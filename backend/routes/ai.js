const express = require('express');
const axios = require('axios');
const router = express.Router();

// @desc Proxy to AI service diet recommendation
// @route POST /api/ai/recommend-diet
router.post('/recommend-diet', async (req, res) => {
  try {
    console.log('🔄 Backend proxy to AI: ', req.body);
    
    const { profile, veg, activity = 'light' } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'profile is required' });
    }

    const aiUrl = process.env.AI_SERVICE_URL;
    if (!aiUrl) {
      return res.status(500).json({ error: 'AI_SERVICE_URL not configured' });
    }

    const aiResponse = await axios.get(`${aiUrl}/recommend-diet`, {
      params: {
        weight: profile.weight ?? 70,
        height: profile.height ?? 170,
        age: profile.age ?? 30,
        gender: profile.gender ?? 'male',
        goal: profile.goal ?? 'loss',
        veg: veg ?? false,
        activity: activity
      }
    });

    
    console.log('✅ AI response received:', aiResponse.data.calories);
    
    res.json(aiResponse.data);
  } catch (error) {
    console.error('❌ AI proxy error:', error.message);
    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
});

module.exports = router;

