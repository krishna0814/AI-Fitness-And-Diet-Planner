const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Progress = require('../models/Progress');
const axios = require('axios');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Update profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', [
  body('profile.weight').isFloat({ min: 30 }),
  body('profile.height').isFloat({ min: 100 })
], authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    
    // Calculate BMI
    const profile = updates.profile || {};
    if (profile.weight && profile.height) {
      const bmi = (profile.weight / ((profile.height/100) ** 2)).toFixed(1);
      const category = bmi < 18.5 ? 'underweight' : 
                      bmi < 25 ? 'normal' : 
                      bmi < 30 ? 'overweight' : 'obese';
      
      updates.bmi = parseFloat(bmi);
      updates.bmiCategory = category;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ profile: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Log progress
// @route   POST /api/user/progress
// @access  Private
router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.create({
      userId: req.user.id,
      ...req.body
    });
    
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get progress history
// @route   GET /api/user/progress
// @access  Private
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ 
      userId: req.user.id 
    }).sort({ date: -1 }).limit(30);
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    AI Diet recommendation (proxy)
// @route   GET /api/user/ai/diet
// @access  Private
router.get('/ai/diet', authMiddleware, async (req, res) => {
  try {
    const { calories, veg } = req.query;
    const aiUrl = process.env.AI_SERVICE_URL;
    if (!aiUrl) {
      return res.status(500).json({ error: 'AI_SERVICE_URL not configured' });
    }
    
    const response = await axios.get(`${aiUrl}/recommend-diet`,
      params: { calories: calories || 2000, veg }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'AI service unavailable', 
      fallback: { message: 'Try again later' }
    });
  }
});

// @desc    AI Workout recommendation
// @route   GET /api/user/ai/workout
// @access  Private
router.get('/ai/workout', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { type = user.profile.preference.workout || 'home' } = req.query;
    
    const aiUrl = process.env.AI_SERVICE_URL;
    if (!aiUrl) {
      return res.status(500).json({ error: 'AI_SERVICE_URL not configured' });
    }
    const response = await axios.get(`${aiUrl}/recommend-workout`, {
      params: { 
        goal: user.profile.goal, 
        bmi: user.bmi,
        type 
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

module.exports = router;

