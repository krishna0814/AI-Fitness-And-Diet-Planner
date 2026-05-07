import { useState, useEffect, useRef } from 'react';

import { motion } from 'framer-motion';

import {
  Apple,
  ChefHat,
  Zap,
  Utensils,
  Salad,
  Egg,
  Carrot
} from 'lucide-react';

import axios from 'axios';

import { useAuth } from '../context/AuthContext.jsx';

import { toast } from 'react-hot-toast';

const Diet = () => {

  const { user } = useAuth();

  const [dietPlan, setDietPlan] = useState(null);

  const [loading, setLoading] = useState(false);

  const [calories, setCalories] = useState(2200);

  const [veg, setVeg] = useState(false);

  const hasFetched = useRef(false);

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {

    if (!user?.profile) return;

    if (hasFetched.current) return;

    hasFetched.current = true;

    fetchDiet();

  }, []);


  const fetchDiet = async () => {

    if (!user?.profile) return;

    setLoading(true);

    try {

      console.log(
        '📡 Calling backend AI proxy:',
        {
          profile: user.profile,
          veg
        }
      );

      const { data } = await axios.post(
        `${API}/api/ai/recommend-diet`,
        {
          profile: user.profile,
          veg
        }
      );

      console.log(
        '✅ AI Diet response:',
        data
      );

      setDietPlan(data);

      localStorage.setItem(
        'dietData',
        JSON.stringify(data)
      );

      toast.success(
        'Personalized Diet Generated'
      );

    } catch (error) {

      console.error(
        '❌ Diet API error:',
        error.response?.data ||
          error.message
      );

      toast.error(
        'Failed to generate diet'
      );

    } finally {

      setLoading(false);

    }

  };


  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-fitness-navy-50">

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="w-24 h-24 border-4 border-fitness-emerald-300 border-t-fitness-emerald-600 rounded-full"
        />

      </div>

    );

  }


  return (

    <div className="p-8 max-w-7xl mx-auto min-h-screen">

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -40
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-16"
      >

        <div className="flex items-center mb-8">

          <div className="w-24 h-24 bg-gradient-to-br from-fitness-emerald-500 to-fitness-amber-500 rounded-4xl flex items-center justify-center shadow-2xl mr-6">

            <Apple className="w-12 h-12 text-white" />

          </div>

          <div>

            <h1 className="text-5xl font-black bg-gradient-to-r from-fitness-emerald-600 to-fitness-navy-500 bg-clip-text text-transparent">
              AI Nutrition Lab
            </h1>

            <p className="text-2xl text-gray-500 font-semibold">
              Personalized diet plan
            </p>

          </div>

        </div>

      </motion.div>


      {/* CONTROLS */}

      <div className="bg-white p-8 rounded-4xl shadow-2xl mb-16">

        <div className="grid lg:grid-cols-3 gap-8 items-end">

          <div>

            <label className="block text-xl font-bold mb-4">
              Target Calories
            </label>

            <input
              type="range"
              min="1500"
              max="3500"
              step="50"
              value={calories}
              onChange={(e) =>
                setCalories(
                  parseInt(e.target.value)
                )
              }
              className="w-full"
            />

            <div className="mt-4 text-3xl font-black text-fitness-emerald-600">
              {calories} kcal
            </div>

          </div>


          <div>

            <label className="block text-xl font-bold mb-4">
              Food Preference
            </label>

            <div className="flex gap-4">

              <button
                onClick={() => setVeg(true)}
                className={`flex-1 py-4 rounded-3xl font-bold ${
                  veg
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                🥗 Veg
              </button>

              <button
                onClick={() => setVeg(false)}
                className={`flex-1 py-4 rounded-3xl font-bold ${
                  !veg
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                🍗 Non-Veg
              </button>

            </div>

          </div>


          <motion.button
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            onClick={fetchDiet}
            className="bg-gradient-to-r from-fitness-emerald-600 to-fitness-navy-500 text-white py-6 rounded-4xl text-2xl font-black shadow-2xl"
          >

            <Zap className="inline mr-3" />

            Generate Diet

          </motion.button>

        </div>

      </div>


      {/* DIET RESULT */}

      {dietPlan && (

        <>

          {/* HEADER */}

          <div className="text-center mb-16">

            <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-4xl text-2xl font-black mb-8">

              <ChefHat className="mr-3" />

              AI Diet Blueprint

            </div>


            <h2 className="text-5xl font-black mb-8">

              {veg
                ? '🥗 Vegetarian Plan'
                : '🍗 Non-Veg Plan'}

            </h2>


            <div className="grid md:grid-cols-4 gap-6">

              <div className="bg-blue-500 text-white p-6 rounded-4xl shadow-2xl">
                <div className="text-4xl font-black">
                  {dietPlan.calories}
                </div>
                <div>Calories</div>
              </div>

              <div className="bg-green-500 text-white p-6 rounded-4xl shadow-2xl">
                <div className="text-4xl font-black">
                  {dietPlan.macros?.protein || 0}g
                </div>
                <div>Protein</div>
              </div>

              <div className="bg-orange-500 text-white p-6 rounded-4xl shadow-2xl">
                <div className="text-4xl font-black">
                  {dietPlan.macros?.carbs || 0}g
                </div>
                <div>Carbs</div>
              </div>

              <div className="bg-purple-500 text-white p-6 rounded-4xl shadow-2xl">
                <div className="text-4xl font-black">
                  {dietPlan.macros?.fats || 0}g
                </div>
                <div>Fats</div>
              </div>

            </div>

          </div>


          {/* MEALS */}

          <div className="grid md:grid-cols-2 gap-8">

            {dietPlan?.meals &&
              Object.entries(
                dietPlan.meals
              ).map(
                (
                  [mealType, mealText],
                  index
                ) => (

                  <motion.div
                    key={mealType}
                    initial={{
                      opacity: 0,
                      y: 40
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: index * 0.1
                    }}
                    className="bg-white p-10 rounded-4xl shadow-2xl"
                  >

                    <div className="mb-4">

                      {mealType ===
                      'breakfast' ? (

                        <Egg className="w-12 h-12 text-orange-500" />

                      ) : mealType ===
                        'lunch' ? (

                        <Utensils className="w-12 h-12 text-blue-500" />

                      ) : mealType ===
                        'dinner' ? (

                        <ChefHat className="w-12 h-12 text-purple-500" />

                      ) : (

                        <Salad className="w-12 h-12 text-green-500" />

                      )}

                    </div>

                    <h3 className="text-3xl font-black capitalize mb-6">

                      {mealType}

                    </h3>

                    <p className="text-xl leading-relaxed text-gray-700">

                      {mealText}

                    </p>

                  </motion.div>

                )
              )}

          </div>

        </>

      )}

    </div>

  );

};

export default Diet;