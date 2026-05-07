require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
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
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// ====================================
// MIDDLEWARE
// ====================================

app.use(helmet());

app.use(express.json({
  limit: '10mb'
}));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);


// ====================================
// TEST ROUTE
// ====================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fitness Backend Ready'
  });
});


// ====================================
// ROUTES
// ====================================

app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);

app.use('/api/ai', aiRoutes);


// ====================================
// DATABASE + SERVER
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

    console.error(
      '❌ MongoDB Error:',
      err.message
    );

  });