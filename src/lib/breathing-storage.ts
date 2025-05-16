// src/lib/breathing-storage.ts
import { format } from 'date-fns';

export interface BreathingSession {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  timestamp: string;
  duration: number; // in seconds
  completed: boolean;
}

// Storage key for breathing sessions
const STORAGE_KEY = 'mindflow_breathing_sessions';

// Get all breathing sessions
export function getBreathingSessions(): BreathingSession[] {
  try {
    const storedSessions = localStorage.getItem(STORAGE_KEY);
    if (!storedSessions) return [];
    return JSON.parse(storedSessions);
  } catch (error) {
    console.error('Error retrieving breathing sessions from localStorage:', error);
    return [];
  }
}

// Add a new breathing session
export function addBreathingSession(session: Omit<BreathingSession, 'id'>): BreathingSession {
  try {
    const sessions = getBreathingSessions();
    
    // Generate a unique ID
    const newSession = {
      ...session,
      id: generateId(),
    };
    
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    console.error('Error saving breathing session to localStorage:', error);
    throw new Error('Failed to save breathing session');
  }
}

// Update an existing breathing session
export function updateBreathingSession(updatedSession: BreathingSession): BreathingSession {
  try {
    const sessions = getBreathingSessions();
    const index = sessions.findIndex(session => session.id === updatedSession.id);
    
    if (index === -1) {
      throw new Error('Session not found');
    }
    
    sessions[index] = updatedSession;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return updatedSession;
  } catch (error) {
    console.error('Error updating breathing session in localStorage:', error);
    throw new Error('Failed to update breathing session');
  }
}

// Delete a breathing session
export function deleteBreathingSession(id: string): void {
  try {
    const sessions = getBreathingSessions();
    const filteredSessions = sessions.filter(session => session.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
  } catch (error) {
    console.error('Error deleting breathing session from localStorage:', error);
    throw new Error('Failed to delete breathing session');
  }
}

// Get sessions for a specific date range
export function getSessionsByDateRange(startDate: Date, endDate: Date): BreathingSession[] {
  try {
    const sessions = getBreathingSessions();
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  } catch (error) {
    console.error('Error filtering breathing sessions by date range:', error);
    return [];
  }
}

// Generate a unique ID for sessions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Get recent sessions (last 7 days)
export function getRecentSessions(limit: number = 10): BreathingSession[] {
  const sessions = getBreathingSessions();
  
  // Sort by date & time (newest first)
  return [...sessions]
    .sort((a, b) => {
      // First sort by date
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      
      // If same date, sort by timestamp
      if (dateComparison === 0) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      
      return dateComparison;
    })
    .slice(0, limit);
}

// Get total completed sessions
export function getTotalCompletedSessions(): number {
  return getBreathingSessions().filter(session => session.completed).length;
}

// Get current streak (consecutive days with completed sessions)
export function getCurrentStreak(): number {
  const sessions = getBreathingSessions();
  
  if (sessions.length === 0) return 0;
  
  // Get completed sessions
  const completedSessions = sessions.filter(session => session.completed);
  
  if (completedSessions.length === 0) return 0;
  
  // Sort by date (newest first)
  const sortedSessions = [...completedSessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format dates as YYYY-MM-DD for comparison
  const formatDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'yyyy-MM-dd');
  };
  
  // Get today's date as YYYY-MM-DD
  const today = formatDateString(new Date().toISOString());
  
  // Check if there's a session for today
  const hasSessionToday = sortedSessions.some(session => formatDateString(session.date) === today);
  
  if (!hasSessionToday) return 0;
  
  let streak = 1;
  let currentDate = new Date();
  
  // Loop through previous days
  for (let i = 1; i <= 365; i++) {
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1);
    const dateStr = formatDateString(currentDate.toISOString());
    
    // Check if there's a session for this day
    const hasSession = sortedSessions.some(session => formatDateString(session.date) === dateStr);
    
    if (hasSession) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Get total time spent on breathing exercises (in minutes)
export function getTotalBreathingTime(): number {
  const sessions = getBreathingSessions().filter(session => session.completed);
  
  if (sessions.length === 0) return 0;
  
  const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
  return Math.round(totalSeconds / 60); // Convert to minutes
}

// Get most practiced exercise
export function getMostPracticedExercise(): { id: string; name: string; count: number } | null {
  const sessions = getBreathingSessions().filter(session => session.completed);
  
  if (sessions.length === 0) return null;
  
  // Count occurrences of each exercise
  const exerciseCounts: Record<string, { id: string; name: string; count: number }> = {};
  
  sessions.forEach(session => {
    if (!exerciseCounts[session.exerciseId]) {
      exerciseCounts[session.exerciseId] = {
        id: session.exerciseId,
        name: session.exerciseName,
        count: 0
      };
    }
    
    exerciseCounts[session.exerciseId].count += 1;
  });
  
  // Find the exercise with the highest count
  return Object.values(exerciseCounts).sort((a, b) => b.count - a.count)[0] || null;
}