import api, { getUserId } from './api-client';

export interface StressEntry {
  id?: string;
  _id?: string;
  userId?: string;
  date: string;
  timestamp?: string;
  level: number;
  factors: string[];
  journal: string;
}

// Get all stress entries
export async function getStressEntries(): Promise<StressEntry[]> {
  try {
    const response = await api.get('/api/stress');
    
    // Map MongoDB _id to id for frontend compatibility
    return response.data.map((entry: any) => ({
      ...entry,
      id: entry._id || entry.id
    }));
  } catch (error) {
    console.error('Error retrieving stress entries:', error);
    // Fallback to local storage
    return getLocalStressEntries();
  }
}

// Add a new stress entry
export async function addStressEntry(entry: Omit<StressEntry, 'id' | '_id' | 'userId'>): Promise<StressEntry> {
  try {
    const entryWithUser = {
      ...entry,
      userId: getUserId()
    };
    
    const response = await api.post('/api/stress', entryWithUser);
    
    // Store in local storage as backup
    const localEntries = getLocalStressEntries();
    const newEntry = {
      ...response.data,
      id: response.data._id || Date.now().toString()
    };
    localStorage.setItem('mindflow_stress_entries', JSON.stringify([...localEntries, newEntry]));
    
    return newEntry;
  } catch (error) {
    console.error('Error saving stress entry:', error);
    return addLocalStressEntry(entry);
  }
}

// Update a stress entry
export async function updateStressEntry(entry: StressEntry): Promise<StressEntry> {
  try {
    const id = entry._id || entry.id;
    const response = await api.put(`/api/stress/${id}`, entry);
    
    // Update in local storage as backup
    updateLocalStressEntry({
      ...entry,
      id: id || ''
    });
    
    return {
      ...response.data,
      id: response.data._id || response.data.id
    };
  } catch (error) {
    console.error('Error updating stress entry:', error);
    return updateLocalStressEntry({
      ...entry,
      id: entry._id || entry.id || ''
    });
  }
}

// Delete a stress entry
export async function deleteStressEntry(id: string): Promise<void> {
  try {
    await api.delete(`/api/stress/${id}`);
    
    // Remove from local storage as backup
    deleteLocalStressEntry(id);
  } catch (error) {
    console.error('Error deleting stress entry:', error);
    deleteLocalStressEntry(id);
  }
}

// Get current streak (consecutive days with entries)
export function getCurrentStreak(): number {
  try {
    const entries = getLocalStressEntries();
    
    if (entries.length === 0) return 0;
    
    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Format dates as YYYY-MM-DD for comparison
    const formatDateString = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    // Get today's date as YYYY-MM-DD
    const today = formatDateString(new Date().toISOString());
    
    // Check if there's an entry for today
    const hasEntryToday = sortedEntries.some(entry => formatDateString(entry.date) === today);
    
    if (!hasEntryToday) return 0;
    
    let streak = 1;
    let currentDate = new Date();
    
    // Loop through previous days
    for (let i = 1; i <= 365; i++) {
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = formatDateString(currentDate.toISOString());
      
      // Check if there's an entry for this day
      const hasEntry = sortedEntries.some(entry => formatDateString(entry.date) === dateStr);
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

// Get total session count
export function getTotalSessions(): number {
  try {
    return getLocalStressEntries().length;
  } catch (error) {
    console.error('Error getting total sessions:', error);
    return 0;
  }
}

// Get average stress level for all entries
export function getOverallAverageStress(): number | null {
  try {
    const entries = getLocalStressEntries();
    
    if (entries.length === 0) return null;
    
    const sum = entries.reduce((total, entry) => total + entry.level, 0);
    return parseFloat((sum / entries.length).toFixed(1));
  } catch (error) {
    console.error('Error calculating average stress:', error);
    return null;
  }
}

// Get last check-in time
export function getLastCheckInTime(): string | null {
  try {
    const entries = getLocalStressEntries();
    
    if (entries.length === 0) return null;
    
    // Sort entries by date and time (newest first)
    const sortedEntries = [...entries].sort((a, b) => {
      // Sort by date first
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      
      // If same date, sort by timestamp
      if (dateComparison === 0 && a.timestamp && b.timestamp) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      
      return dateComparison;
    });
    
    // Get the most recent entry
    const latestEntry = sortedEntries[0];
    
    if (!latestEntry) return null;
    
    // Use timestamp if available, otherwise use date
    const date = latestEntry.timestamp ? new Date(latestEntry.timestamp) : new Date(latestEntry.date);
    
    // Format the date
    const today = new Date();
    const isToday = new Date(date).toDateString() === today.toDateString();
    
    if (isToday) {
      return `Today at ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = new Date(date).toDateString() === yesterday.toDateString();
      
      return isYesterday ? 
        `Yesterday at ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}` : 
        date.toLocaleDateString();
    }
  } catch (error) {
    console.error('Error getting last check-in time:', error);
    return null;
  }
}

// Local storage functions
function getLocalStressEntries(): StressEntry[] {
  try {
    const storedEntries = localStorage.getItem('mindflow_stress_entries');
    if (!storedEntries) return [];
    const parsed = JSON.parse(storedEntries);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return [];
  }
}

function addLocalStressEntry(entry: Omit<StressEntry, 'id' | '_id' | 'userId'>): StressEntry {
  const entries = getLocalStressEntries();
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
    userId: getUserId()
  };
  entries.push(newEntry);
  localStorage.setItem('mindflow_stress_entries', JSON.stringify(entries));
  return newEntry;
}

function updateLocalStressEntry(entry: StressEntry): StressEntry {
  const entries = getLocalStressEntries();
  const index = entries.findIndex(e => e.id === entry.id || e._id === entry.id);
  
  if (index >= 0) {
    entries[index] = { ...entry };
    localStorage.setItem('mindflow_stress_entries', JSON.stringify(entries));
  }
  
  return entry;
}

function deleteLocalStressEntry(id: string): void {
  const entries = getLocalStressEntries();
  const filteredEntries = entries.filter(e => e.id !== id && e._id !== id);
  localStorage.setItem('mindflow_stress_entries', JSON.stringify(filteredEntries));
}