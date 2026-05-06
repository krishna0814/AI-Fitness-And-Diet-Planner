const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Wait for DB before any query
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not ready. Please wait.' });
  }
  next();
});

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('profile.name').notEmpty()
], async (req, res) => {
  try {
    const { email, password, profile } = req.body;

    console.log('📝 Register attempt:', email);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      profile
    });

    console.log('✅ User created:', user._id);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, profile: user.profile }
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.correctPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login success:', user.email);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, email: user.email, profile: user.profile || { name: 'Demo User' } }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Robust calorie calculation using user.profile
    const profile = user.profile || {};
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    const gender = (profile.gender || 'male').toLowerCase();
    const goal = profile.goal || 'loss';

    // Activity comes from profile.preference (existing app stores workout preference)
    const preference = profile.preference || {};
    const activity = (preference.activity || preference.workoutActivity || preference.workout || 'light').toString().toLowerCase();

    // Validation + safe fallback
    // If age is missing, fallback to a conservative default so we still return non-zero calories.
    const fallbackCalories = 2000;
    const hasBasics = Number.isFinite(weight) && weight > 0 && Number.isFinite(height) && height > 0 && Number.isFinite(age) && age >= 16;
    const safeAge = Number.isFinite(age) && age >= 16 ? age : 30;
    const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : 70;
    const safeHeight = Number.isFinite(height) && height > 0 ? height : 170;


    const calcCalories = () => {
      // Mifflin-St Jeor BMR
      // weight: kg, height: cm, age: years
      const bmr = gender === 'female'
        ? 10 * weight + 6.25 * height - 5 * age - 161
        : 10 * weight + 6.25 * height - 5 * age + 5;

      const tdeeMult = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
      };

      const mult = tdeeMult[(activity || 'light').toLowerCase()] || tdeeMult.light;
      const tdee = bmr * mult;

      const goalAdj = {
        loss: -500,
        gain: 300,
        maintain: 0,
        build: 500,
      };

      const adj = goalAdj[goal] ?? 0;
      const calories = Math.max(1500, Math.round(tdee + adj));
      return calories;
    };

    const calories = hasBasics ? calcCalories() : fallbackCalories;

    res.json({
      id: user._id,
      email: user.email,
      profile,
      calories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
