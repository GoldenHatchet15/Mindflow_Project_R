// src/lib/meditation-storage.ts
import { format } from 'date-fns';

// Define types for meditation data
export interface MeditationSession {
  id: string;
  technique: {
    id: string;
    title: string;
    category?: string;
    image?: string;
  };
  startedAt?: string;
  completedAt: string;
  duration: number; // in seconds
  completed: boolean;
}

// Storage key for meditation sessions
const STORAGE_KEY = 'mindflow_meditation_sessions';

// Get all meditation sessions
export function getMeditationSessions(): MeditationSession[] {
  try {
    const storedSessions = localStorage.getItem(STORAGE_KEY);
    if (!storedSessions) return [];
    return JSON.parse(storedSessions);
  } catch (error) {
    console.error('Error retrieving meditation sessions from localStorage:', error);
    return [];
  }
}

// Add a new meditation session
export function addMeditationSession(session: Omit<MeditationSession, 'id'>): MeditationSession {
  try {
    const sessions = getMeditationSessions();
    
    // Generate a unique ID
    const newSession = {
      ...session,
      id: Date.now().toString(),
    };
    
    // Add to beginning of array (most recent first)
    sessions.unshift(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    console.error('Error saving meditation session to localStorage:', error);
    throw new Error('Failed to save meditation session');
  }
}

// Delete a meditation session
export function deleteMeditationSession(id: string): void {
  try {
    const sessions = getMeditationSessions();
    const filteredSessions = sessions.filter(session => session.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
  } catch (error) {
    console.error('Error deleting meditation session from localStorage:', error);
    throw new Error('Failed to delete meditation session');
  }
}

// Function to save a completed meditation session
export function saveCompletedSession(technique: any, durationInSeconds: number): void {
  try {
    const now = new Date();
    
    // Create a simplified version of the technique data
    const simplifiedTechnique = {
      id: technique.id || 'unknown',
      title: technique.title || 'Meditation',
      category: technique.category || 'Focus',
      image: technique.backgroundImage || technique.coverImage || '/images/meditation/default.jpg'
    };
    
    // Create the session object
    const session: Omit<MeditationSession, 'id'> = {
      technique: simplifiedTechnique,
      startedAt: new Date(now.getTime() - durationInSeconds * 1000).toISOString(),
      completedAt: now.toISOString(),
      duration: durationInSeconds,
      completed: true
    };
    
    // Add the session to storage
    addMeditationSession(session);
  } catch (error) {
    console.error('Error saving completed meditation session:', error);
  }
}

// Get recent sessions
export function getRecentSessions(limit: number = 10): MeditationSession[] {
  try {
    const sessions = getMeditationSessions();
    return sessions.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent sessions:', error);
    return [];
  }
}

// Get total sessions count
export function getTotalSessions(): number {
  return getMeditationSessions().length;
}

// Get total meditation time in minutes
export function getTotalMeditationTime(): number {
  try {
    const sessions = getMeditationSessions();
    
    if (sessions.length === 0) return 0;
    
    const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
    return Math.round(totalSeconds / 60); // Convert to minutes
  } catch (error) {
    console.error('Error calculating total meditation time:', error);
    return 0;
  }
}

// Get meditation streak (consecutive days)
export function getMeditationStreak(): number {
  try {
    const sessions = getMeditationSessions();
    
    if (sessions.length === 0) return 0;
    
    // Format dates as YYYY-MM-DD for comparison
    const formatDateString = (dateStr: string) => {
      const date = new Date(dateStr);
      return format(date, 'yyyy-MM-dd');
    };
    
    // Group sessions by date
    const sessionsByDate: Record<string, boolean> = {};
    sessions.forEach(session => {
      const dateStr = formatDateString(session.completedAt);
      sessionsByDate[dateStr] = true;
    });
    
    // Get all dates with sessions
    const dates = Object.keys(sessionsByDate).sort().reverse();
    
    if (dates.length === 0) return 0;
    
    // Get today's date as YYYY-MM-DD
    const today = formatDateString(new Date().toISOString());
    
    // Check if there's a session for today
    if (dates[0] !== today) return 0;
    
    let streak = 1;
    
    // Check consecutive days
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1]);
      const currDate = new Date(dates[i]);
      
      // Set hours to 0 to compare just the dates
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);
      
      // Calculate difference in days
      const diffTime = prevDate.getTime() - currDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating meditation streak:', error);
    return 0;
  }
}

// Get most practiced meditation type
export function getMostPracticedMeditation(): { id: string; title: string; count: number } | null {
  try {
    const sessions = getMeditationSessions();
    
    if (sessions.length === 0) return null;
    
    // Count occurrences of each technique
    const techniqueCounts: Record<string, { id: string; title: string; count: number }> = {};
    
    sessions.forEach(session => {
      const id = session.technique.id;
      if (!techniqueCounts[id]) {
        techniqueCounts[id] = {
          id,
          title: session.technique.title,
          count: 0
        };
      }
      
      techniqueCounts[id].count += 1;
    });
    
    // Find the technique with the highest count
    return Object.values(techniqueCounts).sort((a, b) => b.count - a.count)[0] || null;
  } catch (error) {
    console.error('Error finding most practiced meditation:', error);
    return null;
  }
}

// Clear all meditation sessions (for testing)
export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}