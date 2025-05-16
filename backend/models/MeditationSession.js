const mongoose = require('mongoose');

const MeditationSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  technique: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    image: {
      type: String
    }
  },
  startedAt: {
    type: String
  },
  completedAt: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('MeditationSession', MeditationSessionSchema);