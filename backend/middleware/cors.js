const cors = require('cors');

const corsOptions = {
  origin: "https://ai-fitness-and-diet-planner.vercel.app",

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);

