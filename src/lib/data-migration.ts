import api, { getUserId } from './api-client';

// Flag to indicate if migration has been run
const MIGRATION_FLAG = 'mindflow_data_migration_completed';

// Check if migration has been run
export const hasMigrationRun = (): boolean => {
  return localStorage.getItem(MIGRATION_FLAG) === 'true';
};

// Set migration as completed
export const setMigrationCompleted = (): void => {
  localStorage.setItem(MIGRATION_FLAG, 'true');
};

// Migrate all data to MongoDB
export const migrateAllData = async (): Promise<boolean> => {
  if (hasMigrationRun()) {
    console.log('Data migration already completed');
    return true;
  }
  
  try {
    // Get all data from local storage
    const stressEntries = getLocalData('mindflow_stress_entries');
    const breathingSessions = getLocalData('mindflow_breathing_sessions');
    const meditationSessions = getLocalData('mindflow_meditation_sessions');
    
    // Migrate each type of data
    await migrateStressEntries(stressEntries);
    await migrateBreathingSessions(breathingSessions);
    await migrateMeditationSessions(meditationSessions);
    
    // Mark migration as completed
    setMigrationCompleted();
    
    console.log('Data migration completed successfully');
    return true;
  } catch (error) {
    console.error('Error during data migration:', error);
    return false;
  }
};

// Get data from local storage
const getLocalData = (key: string): any[] => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error getting data from localStorage (${key}):`, error);
    return [];
  }
};

// Migrate stress entries
const migrateStressEntries = async (entries: any[]): Promise<void> => {
  if (!entries || entries.length === 0) {
    console.log('No stress entries to migrate');
    return;
  }
  
  console.log(`Migrating ${entries.length} stress entries`);
  
  const userId = getUserId();
  
  // Process batches of 10 entries at a time
  const batchSize = 10;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    
    // Process each entry in the batch
    const promises = batch.map(entry => {
      const entryWithUserId = {
        ...entry,
        userId
      };
      
      // Remove client-side id to avoid conflicts
      delete entryWithUserId.id;
      
      return api.post('/api/stress', entryWithUserId)
        .catch(error => {
          console.error('Error migrating stress entry:', error);
          return null;
        });
    });
    
    // Wait for all promises in the batch to resolve
    await Promise.all(promises);
    console.log(`Migrated batch ${i / batchSize + 1}/${Math.ceil(entries.length / batchSize)}`);
  }
  
  console.log('Stress entries migration completed');
};

// Migrate breathing sessions
const migrateBreathingSessions = async (sessions: any[]): Promise<void> => {
  if (!sessions || sessions.length === 0) {
    console.log('No breathing sessions to migrate');
    return;
  }
  
  console.log(`Migrating ${sessions.length} breathing sessions`);
  
  const userId = getUserId();
  
  // Process batches of 10 sessions at a time
  const batchSize = 10;
  for (let i = 0; i < sessions.length; i += batchSize) {
    const batch = sessions.slice(i, i + batchSize);
    
    // Process each session in the batch
    const promises = batch.map(session => {
      const sessionWithUserId = {
        ...session,
        userId
      };
      
      // Remove client-side id to avoid conflicts
      delete sessionWithUserId.id;
      
      return api.post('/api/breathing', sessionWithUserId)
        .catch(error => {
          console.error('Error migrating breathing session:', error);
          return null;
        });
    });
    
    // Wait for all promises in the batch to resolve
    await Promise.all(promises);
    console.log(`Migrated batch ${i / batchSize + 1}/${Math.ceil(sessions.length / batchSize)}`);
  }
  
  console.log('Breathing sessions migration completed');
};

// Migrate meditation sessions
const migrateMeditationSessions = async (sessions: any[]): Promise<void> => {
  if (!sessions || sessions.length === 0) {
    console.log('No meditation sessions to migrate');
    return;
  }
  
  console.log(`Migrating ${sessions.length} meditation sessions`);
  
  const userId = getUserId();
  
  // Process batches of 10 sessions at a time
  const batchSize = 10;
  for (let i = 0; i < sessions.length; i += batchSize) {
    const batch = sessions.slice(i, i + batchSize);
    
    // Process each session in the batch
    const promises = batch.map(session => {
      const sessionWithUserId = {
        ...session,
        userId
      };
      
      // Remove client-side id to avoid conflicts
      delete sessionWithUserId.id;
      
      return api.post('/api/meditation', sessionWithUserId)
        .catch(error => {
          console.error('Error migrating meditation session:', error);
          return null;
        });
    });
    
    // Wait for all promises in the batch to resolve
    await Promise.all(promises);
    console.log(`Migrated batch ${i / batchSize + 1}/${Math.ceil(sessions.length / batchSize)}`);
  }
  
  console.log('Meditation sessions migration completed');
};