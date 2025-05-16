const mongoose = require('mongoose');

const BreathingSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  exerciseId: {
    type: String,
    required: true
  },
  exerciseName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('BreathingSession', BreathingSessionSchema);