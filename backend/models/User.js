const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 6,
    select: false
  },
  profile: {
    name: { type: String, trim: true },
    age: { type: Number, min: 16, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    height: { type: Number }, // cm
    weight: { type: Number }, // kg
    goal: { 
      type: String, 
      enum: ['loss', 'gain', 'maintain', 'build'] 
    },
    preference: {
      diet: { type: String, enum: ['veg', 'non-veg'] },
      workout: { type: String, enum: ['home', 'gym'] }
    }
  },
  bmi: { type: Number }, // calculated
  bmiCategory: { 
    type: String, 
    enum: ['underweight', 'normal', 'overweight', 'obese'] 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

