const mongoose = require('mongoose');

const StressEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true
  },
  timestamp: {
    type: String
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  factors: [{
    type: String
  }],
  journal: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('StressEntry', StressEntrySchema);