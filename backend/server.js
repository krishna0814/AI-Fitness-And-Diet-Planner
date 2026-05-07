require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ROUTES
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();

const PORT = process.env.PORT || 5000;


// ====================================
// CORS
// ====================================

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-fitness-and-diet-planner.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
}));


// ====================================
// MIDDLEWARE
// ====================================

app.use(express.json());


// ====================================
// TEST ROUTE
// ====================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Working'
  });
});


// ====================================
// AUTH ROUTES
// ====================================

app.use('/api/auth', authRoutes);


// ====================================
// AI ROUTES
// ====================================

app.use('/api/ai', aiRoutes);


// ====================================
// DATABASE CONNECTION
// ====================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.log('✅ MongoDB Connected');

    app.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

    });

  })
  .catch((err) => {

    console.log(
      '❌ MongoDB Error:',
      err.message
    );

  });