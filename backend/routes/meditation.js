const express = require('express');
const router = express.Router();
const MeditationSession = require('../models/MeditationSession');

// Get all meditation sessions for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || req.header('x-user-id');
    
    if (!userId) {
      console.log('No userId provided in meditation GET');
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    console.log(`GET /api/meditation for user ${userId}`);
    
    const sessions = await MeditationSession.find({ userId }).sort({ completedAt: -1 });
    console.log(`Found ${sessions.length} meditation sessions for user ${userId}`);
    
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching meditation sessions:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a new meditation session
router.post('/', async (req, res) => {
  try {
    const { userId, technique, startedAt, completedAt, duration, completed } = req.body;
    
    console.log('POST /api/meditation', { userId, technique, completedAt, duration });
    
    if (!userId || !technique || !completedAt || duration === undefined) {
      console.log('Missing required fields', { userId, technique, completedAt, duration });
      return res.status(400).json({ msg: 'Missing required fields' });
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

// Delete a meditation session
router.delete('/:id', async (req, res) => {
  try {
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

module.exports = router;