require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 5000;


// ====================
// MIDDLEWARE
// ====================

app.use(cors());

app.use(express.json());


// ====================
// TEST ROUTE
// ====================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Working'
  });
});


// ====================
// DATABASE
// ====================

mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.log('✅ MongoDB Connected');

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on ${PORT}`
      );
    });

  })
  .catch((err) => {

    console.log(
      'Mongo Error:',
      err.message
    );

  });