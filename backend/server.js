require('dotenv').config();
console.log('🔥 ENV DEBUG - MONGO_URI:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : 'MISSING');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Test endpoint
app.get('/', (req, res) => res.json({ message: 'Fitness Backend Ready', mongoUri: !!process.env.MONGO_URI }));

// Connect DB FIRST
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected - REAL DB LIVE');
    
    // Middleware AFTER DB
    app.use(helmet());
    // Use central production CORS config
    app.use(require('./middleware/cors'));

    app.use(express.json({ limit: '10mb' }));
    app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

    // Routes AFTER middleware
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    const aiRoutes = require('./routes/ai');
    app.use('/api/ai', aiRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Backend LIVE: port ${PORT}`);
      console.log('✅ Login/register/AI proxy ready!');
    });

  })
  .catch((err) => {
    console.error('❌ MongoDB FAILED:', err.message);
    console.log('🔄 Starting MOCK MODE');
    
    // Start anyway for UI demo
    app.use(helmet());
    app.use(cors({
      origin: "https://ai-fitness-and-diet-planner.vercel.app",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json({ limit: '10mb' }));
    
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend MOCK LIVE: port ${PORT}`);
      console.log('✅ UI Demo working');
    });

  });

