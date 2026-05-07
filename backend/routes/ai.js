const express = require('express');

const router = express.Router();


// ======================================
// DIET RECOMMENDATION API
// ======================================

router.post('/recommend-diet', async (req, res) => {

  try {

    const { profile, veg } = req.body;

    if (!profile) {
      return res.status(400).json({
        error: 'Profile is required'
      });
    }

    // ======================================
    // USER DATA
    // ======================================

    const weight = Number(profile.weight || 70);

    const height = Number(profile.height || 170);

    const age = Number(profile.age || 25);

    const gender = profile.gender || 'male';

    const goal = profile.goal || 'maintain';


    // ======================================
    // BMI
    // ======================================

    const bmi = (
      weight /
      ((height / 100) * (height / 100))
    ).toFixed(1);


    // ======================================
    // BMR CALCULATION
    // ======================================

    let bmr;

    if (gender === 'male') {

      bmr =
        10 * weight +
        6.25 * height -
        5 * age +
        5;

    } else {

      bmr =
        10 * weight +
        6.25 * height -
        5 * age -
        161;

    }


    // ======================================
    // DAILY CALORIES
    // ======================================

    let calories = Math.round(bmr * 1.4);

    if (goal === 'loss') {
      calories -= 400;
    }

    if (
      goal === 'gain' ||
      goal === 'muscle'
    ) {
      calories += 300;
    }


    // ======================================
    // MACROS
    // ======================================

    const protein = Math.round(weight * 2);

    const fats = Math.round(weight * 0.8);

    const carbs = Math.round(
      (calories -
        protein * 4 -
        fats * 9) / 4
    );


    // ======================================
    // DYNAMIC MEAL PLANS
    // ======================================

    let meals = {};


    // ======================================
    // WEIGHT LOSS
    // ======================================

    if (goal === 'loss') {

      meals = veg
        ? {
            breakfast:
              'Oats + Green Tea + Apple',

            lunch:
              'Brown Rice + Dal + Salad',

            dinner:
              'Vegetable Soup + Chapati',

            snacks:
              'Fruits + Almonds'
          }
        : {
            breakfast:
              'Boiled Eggs + Oats + Green Tea',

            lunch:
              'Grilled Chicken + Brown Rice + Salad',

            dinner:
              'Fish + Vegetables',

            snacks:
              'Boiled Eggs + Nuts'
          };

    }


    // ======================================
    // MUSCLE GAIN
    // ======================================

    else if (
      goal === 'gain' ||
      goal === 'muscle'
    ) {

      meals = veg
        ? {
            breakfast:
              'Paneer Sandwich + Banana Shake',

            lunch:
              'Rice + Paneer + Dal + Curd',

            dinner:
              'Chapati + Soybean + Vegetables',

            snacks:
              'Protein Shake + Peanut Butter'
          }
        : {
            breakfast:
              'Eggs + Banana Shake + Oats',

            lunch:
              'Chicken Breast + Rice + Salad',

            dinner:
              'Fish + Chapati + Vegetables',

            snacks:
              'Protein Shake + Boiled Eggs'
          };

    }


    // ======================================
    // MAINTAIN BODY
    // ======================================

    else {

      meals = veg
        ? {
            breakfast:
              'Poha + Milk + Fruits',

            lunch:
              'Rice + Dal + Vegetables',

            dinner:
              'Chapati + Paneer + Salad',

            snacks:
              'Dry Fruits + Yogurt'
          }
        : {
            breakfast:
              'Eggs + Toast + Milk',

            lunch:
              'Chicken + Rice + Salad',

            dinner:
              'Fish + Vegetables + Chapati',

            snacks:
              'Fruits + Nuts'
          };

    }


    // ======================================
    // FINAL RESPONSE
    // ======================================

    res.json({

      success: true,

      bmi,

      calories,

      macros: {
        protein,
        carbs,
        fats
      },

      meals

    });

  } catch (error) {

    console.error(
      '❌ Diet API Error:',
      error.message
    );

    res.status(500).json({
      error: 'Diet generation failed'
    });

  }

});

module.exports = router;