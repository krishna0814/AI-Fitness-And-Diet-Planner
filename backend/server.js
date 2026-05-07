require('dotenv').config();

console.log(
  '🔥 ENV DEBUG - MONGO_URI:',
  process.env.MONGO_URI
    ? process.env.MONGO_URI.substring(0, 30) + '...'
    : 'MISSING'
);

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


// =====================================
// CORS CONFIG
// =====================================

const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-fitness-and-diet-planner.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {

    // Allow requests with no origin
    if (!origin) {
      return callback(null, true);
    }

    // Allow frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Block other origins
    return callback(new Error('CORS Not Allowed'));
  },

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
};


// =====================================
// GLOBAL MIDDLEWARE
// =====================================

app.use(helmet());

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);


// =====================================
// TEST ROUTE
// =====================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fitness Backend Ready',
    mongoConnected: !!process.env.MONGO_URI
  });
});


// =====================================
// API ROUTES
// =====================================

app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);

app.use('/api/ai', aiRoutes);


// =====================================
// DATABASE CONNECTION
// =====================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log('✅ MongoDB Connected');

    app.listen(PORT, () => {
      console.log(
        `🚀 Backend Running On Port ${PORT}`
      );
    });

  })
  .catch((err) => {

    console.error(
      '❌ MongoDB Connection Error:',
      err.message
    );

    process.exit(1);

  });