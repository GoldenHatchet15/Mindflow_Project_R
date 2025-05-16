const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load models
const StressEntry = require('./models/StressEntry');
const BreathingSession = require('./models/BreathingSession');
const MeditationSession = require('./models/MeditationSession');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
let isConnected = false;
(async () => {
  isConnected = await connectDB();
  console.log(`MongoDB connection status: ${isConnected ? 'Connected' : 'Not connected'}`);
})();

// Add a route to check MongoDB connection status
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    mongoDbConnection: isConnected ? 'connected' : 'disconnected'
  });
});

// Log MongoDB connection status every minute
setInterval(() => {
  console.log(`MongoDB connection status: ${isConnected ? 'Connected' : 'Not connected'}`);
  if (!isConnected) {
    // Try to reconnect
    (async () => {
      console.log('Attempting to reconnect to MongoDB...');
      isConnected = await connectDB();
    })();
  }
}, 60000);

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mindflow API is running',
    mongoDBConnected: isConnected
  });
});

// ====== STRESS ROUTES ======
app.get('/api/stress', async (req, res) => {
  try {
    const userId = req.query.userId || req.header('x-user-id');
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning empty array');
      return res.json([]);
    }
    
    const entries = await StressEntry.find({ userId }).sort({ timestamp: -1 });
    console.log(`Found ${entries.length} stress entries for user ${userId}`);
    
    res.json(entries);
  } catch (err) {
    console.error('Error fetching stress entries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stress', async (req, res) => {
  try {
    const { userId, date, timestamp, level, factors, journal } = req.body;
    
    if (!userId || !date || level === undefined) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: 'mock-id-' + Date.now() });
    }
    
    const newEntry = new StressEntry({
      userId,
      date,
      timestamp,
      level,
      factors: factors || [],
      journal: journal || ''
    });
    
    const savedEntry = await newEntry.save();
    console.log(`Saved new stress entry with ID: ${savedEntry._id}`);
    
    res.json(savedEntry);
  } catch (err) {
    console.error('Error saving stress entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stress/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: req.params.id });
    }
    
    const updatedEntry = await StressEntry.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedEntry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }
    
    res.json(updatedEntry);
  } catch (err) {
    console.error('Error updating stress entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stress/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ msg: 'Entry deleted', id: req.params.id });
    }
    
    const entry = await StressEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }
    
    await entry.deleteOne();
    res.json({ msg: 'Entry deleted', id: req.params.id });
  } catch (err) {
    console.error('Error deleting stress entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ====== BREATHING ROUTES ======
// Similar routes for breathing as with stress...
app.post('/api/breathing', async (req, res) => {
  try {
    const { userId, exerciseId, exerciseName, date, timestamp, duration, completed } = req.body;
    
    if (!userId || !exerciseId || !date || !timestamp) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: 'mock-id-' + Date.now() });
    }
    
    const newSession = new BreathingSession({
      userId,
      exerciseId,
      exerciseName,
      date,
      timestamp,
      duration,
      completed: completed !== undefined ? completed : false
    });
    
    const savedSession = await newSession.save();
    console.log(`Saved new breathing session with ID: ${savedSession._id}`);
    
    res.json(savedSession);
  } catch (err) {
    console.error('Error saving breathing session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/breathing/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: req.params.id });
    }
    
    const updatedSession = await BreathingSession.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedSession) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    res.json(updatedSession);
  } catch (err) {
    console.error('Error updating breathing session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/breathing/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ msg: 'Session deleted', id: req.params.id });
    }
    
    const session = await BreathingSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    await session.deleteOne();
    res.json({ msg: 'Session deleted', id: req.params.id });
  } catch (err) {
    console.error('Error deleting breathing session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ====== MEDITATION ROUTES ======
app.get('/api/meditation', async (req, res) => {
  try {
    const userId = req.query.userId || req.header('x-user-id');
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    console.log(`GET /api/meditation for user ${userId}`);
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning empty array');
      return res.json([]);
    }
    
    const sessions = await MeditationSession.find({ userId }).sort({ completedAt: -1 });
    console.log(`Found ${sessions.length} meditation sessions for user ${userId}`);
    
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching meditation sessions:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/meditation', async (req, res) => {
  try {
    const { userId, technique, startedAt, completedAt, duration, completed } = req.body;
    
    if (!userId || !technique || !completedAt || duration === undefined) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: 'mock-id-' + Date.now() });
    }
    
    const newSession = new MeditationSession({
      userId,
      technique,
      startedAt,
      completedAt,
      duration,
      completed: completed !== undefined ? completed : true
    });
    
    const savedSession = await newSession.save();
    console.log(`Saved new meditation session with ID: ${savedSession._id}`);
    
    res.json(savedSession);
  } catch (err) {
    console.error('Error saving meditation session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/meditation/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ msg: 'Session deleted', id: req.params.id });
    }
    
    const session = await MeditationSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    await session.deleteOne();
    res.json({ msg: 'Session deleted', id: req.params.id });
  } catch (err) {
    console.error('Error deleting meditation session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));