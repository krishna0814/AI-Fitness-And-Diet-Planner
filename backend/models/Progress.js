const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  weight: { type: Number }, // kg
  caloriesIn: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  workoutDuration: { type: Number, default: 0 }, // minutes
  dietCompliance: { type: Number, default: 0 }, // 0-100%
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);

