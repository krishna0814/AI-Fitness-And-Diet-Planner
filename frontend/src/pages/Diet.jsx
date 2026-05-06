import { useState, useEffect, useRef } from 'react';

import { motion } from 'framer-motion';
import { Apple, ChefHat, Zap, Utensils, Salad, Egg, Carrot } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';

const Diet = () => {
  const { user } = useAuth();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const [calories, setCalories] = useState(2200);
  const [veg, setVeg] = useState(false);
  const [timeframe, setTimeframe] = useState('day'); // day/week/month

  const API_URL = import.meta.env.VITE_API_URL;

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user?.profile) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    console.log('API CALLED ONCE');
    fetchDiet();
    // keep dependency empty to run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchDiet = async () => {
    if (!user?.profile) return;
    
    setLoading(true);
    try {
      console.log('📡 Calling backend AI proxy:', { profile: user.profile, veg, activity: 'light' });
      
      const API = import.meta.env.VITE_API_URL;
      const { data } = await axios.post(`${API}/api/ai/recommend-diet`, {
        profile: user.profile,
        veg,
        activity: 'light'
      });
      
      console.log('✅ AI Diet response:', data);

      // Persist latest AI diet so Dashboard can show real kcal
      try {
        localStorage.setItem('dietData', JSON.stringify(data));
      } catch (e) {
        console.warn('Could not persist dietData to localStorage', e);
      }

      setDietPlan(data);
      toast.success(`Personalized Diet Generated: ${data.calories}kcal/day (BMR:${data.bmr} TDEE:${data.tdee})`);

    } catch (error) {
      console.error('❌ Diet API error:', error.response?.data || error.message);
      toast.error('AI service temporarily unavailable. Try again.');
      // No fallback - let user retry
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    fetchDiet();
  };




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-12 relative bg-gradient-to-br from-emerald-50 to-fitness-navy-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 border-4 border-fitness-emerald-200/50 border-t-fitness-emerald-600 rounded-full shadow-2xl"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-2xl text-muted-foreground font-semibold"
        >
          Your AI chef is cooking up perfection...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-7xl mx-auto relative overflow-hidden min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-fitness-navy-50">
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-br from-fitness-emerald-400/10 to-fitness-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20"
      >
        {/* Header */}
        <div className="flex items-center mb-20">
          <motion.div 
            animate={{ rotate: [0, 10, -5, 10, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="w-28 h-28 bg-gradient-to-br from-fitness-emerald-500 to-fitness-amber-500 text-white p-7 rounded-4xl mr-8 shadow-2xl fitness-glow flex-shrink-0"
          >
            <Apple className="w-14 h-14 mx-auto" />
          </motion.div>
          <div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-fitness-emerald-600 via-fitness-amber-500 to-fitness-navy-500 bg-clip-text text-transparent mb-6">
              AI Nutrition Lab
            </h1>
            <p className="text-3xl text-muted-foreground font-semibold opacity-90">Precision engineered meal plans</p>
          </div>
        </div>

        {/* Controls Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-4xl p-12 shadow-2xl border border-white/40 mb-20 fitness-glow hover:shadow-glow-primary"
        >
          <div className="grid lg:grid-cols-4 gap-8 items-end">
            <div>
              <label className="block text-xl font-black mb-6 text-fitness-navy-700 flex items-center">
                <Zap className="w-7 h-7 mr-3" />
                Target Calories
              </label>
              <input
                type="range"
                min="1500" max="3500" step="50"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value))}
                className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer accent-fitness-emerald-500 shadow-lg hover:shadow-lg transition-all"
              />
              <div className="text-center">
                <span className="text-4xl font-black text-fitness-emerald-600">{calories}</span>
                <span className="text-lg font-semibold text-muted-foreground ml-2">kcal/day</span>
              </div>
            </div>
            <div className="lg:col-span-1">
              <label className="flex items-center mb-6">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 text-white font-bold text-sm ${
                  veg ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                  {veg ? '🥗' : '🍗'}
                </div>
                <span className="text-xl font-black">Vegetarian Preference</span>
              </label>
              <motion.div 
                className="flex space-x-4"
                layout
              >
                <button
                  onClick={() => setVeg(true)}
                  className={`flex-1 p-4 rounded-3xl font-bold transition-all shadow-lg ${
                    veg 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-glow-success fitness-glow' 
                      : 'bg-white/70 dark:bg-slate-800/70 hover:bg-green-50 border-2 border-green-200 text-green-700 dark:text-green-300'
                  }`}
                >
                  🥗 Veg
                </button>
                <button
                  onClick={() => setVeg(false)}
                  className={`flex-1 p-4 rounded-3xl font-bold transition-all shadow-lg ${
                    !veg 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-glow-energy fitness-glow' 
                      : 'bg-white/70 dark:bg-slate-800/70 hover:bg-orange-50 border-2 border-orange-200 text-orange-700 dark:text-orange-300'
                  }`}
                >
                  🍗 Non-Veg
                </button>
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              className="lg:col-span-2 bg-gradient-to-r from-fitness-emerald-600 to-fitness-navy-500 hover:from-fitness-emerald-700 hover:to-fitness-navy-600 text-white font-black py-12 px-16 rounded-4xl text-2xl shadow-2xl fitness-glow hover:shadow-glow-success transition-all border-0"
            >
              <Zap className="w-12 h-12 inline mr-6 relative -top-1 animate-pulse" />
              <span>Generate AI Masterplan</span>
            </motion.button>
          </div>
        </motion.div>

        {dietPlan && (
          <>
            {/* Plan Header */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-20"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center bg-gradient-to-r from-fitness-amber-400 to-orange-500 text-white px-10 py-6 rounded-4xl text-2xl font-black mb-8 shadow-2xl fitness-glow"
              >
                <ChefHat className="w-10 h-10 mr-4" />
                <span>AI Nutrition Blueprint</span>
              </motion.div>
              <motion.h2 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-6xl font-black mb-6 ${veg ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-red-500'} bg-gradient-to-r bg-clip-text text-transparent`}
              >
                {veg ? '🥗 Pure Plant Power' : '🍗 Protein Optimized'}
              </motion.h2>
              <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-12 text-3xl font-bold">
                <div className="bg-white/30 dark:bg-slate-700/30 backdrop-blur-xl px-12 py-6 rounded-4xl shadow-lg">
                  <div className="text-5xl">{dietPlan.calories.toLocaleString()}</div>
                  <div className="text-xl opacity-90">kcal target</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-3xl shadow-2xl">
                    <div className="text-3xl font-black">💪</div>
                    <div>{dietPlan.macros_g?.protein || 0}g</div>
                    <div className="text-sm opacity-90">Protein</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">
                    <div className="text-3xl font-black">🍠</div>
                    <div>{dietPlan.macros_g?.carbs || 0}g</div>
                    <div className="text-sm opacity-90">Carbs</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-6 rounded-3xl shadow-2xl">
                    <div className="text-3xl font-black">🥑</div>
                    <div>{dietPlan.macros_g?.fat || 0}g</div>
                    <div className="text-sm opacity-90">Fat</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-white/40 to-transparent backdrop-blur-xl px-12 py-6 rounded-4xl shadow-lg font-black text-4xl max-w-md">
                  {dietPlan.reasoning}
                </div>
              </div>
            </motion.div>

            {/* Meal Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {dietPlan.plan.map((meal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-12 rounded-4xl shadow-2xl border border-white/40 hover:shadow-glow-success hover:border-fitness-emerald-300/50 transition-all cursor-pointer overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 from-fitness-emerald-500/10 to-transparent" />
                  <div className="relative">
                    <div className="flex items-start space-x-6 mb-8">
                      <div className={`p-6 rounded-4xl font-black text-4xl flex-shrink-0 shadow-2xl ${
                        index === 0 ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-blue-500 to-fitness-navy-500 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white' :
                        'bg-gradient-to-br from-fitness-emerald-500 to-green-600 text-white'
                      }`}>
                        {index === 0 ? '🥞' : index === 1 ? '🍲' : index === 2 ? '🍽️' : '🥗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-4xl font-black mb-6 group-hover:text-fitness-navy-600 dark:group-hover:text-fitness-emerald-400 transition-colors">{meal.meal}</h3>
                        <div className="text-6xl font-black text-fitness-emerald-600 mb-6 drop-shadow-lg">{meal.calories}kcal</div>
<div className="flex flex-col sm:flex-row gap-4 justify-between mb-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-3xl">
                          <span className="flex items-center font-semibold text-lg text-gray-800 dark:text-gray-200">
                            <span className="text-2xl mr-2">💪</span>
                            <span>{meal.protein || 0}g Protein</span>
                          </span>
                          <span className="flex items-center font-semibold text-lg text-gray-800 dark:text-gray-200">
                            <span className="text-2xl mr-2">🍚</span>
                            <span>{meal.carbs || 0}g Carbs</span>
                          </span>
                          <span className="flex items-center font-semibold text-lg text-gray-800 dark:text-gray-200">
                            <span className="text-2xl mr-2">🥑</span>
                            <span>{meal.fat || 0}g Fat</span>
                          </span>
                        </div>
                        <p className="text-2xl leading-relaxed text-gray-700 dark:text-gray-200">{meal.items.join(', ')}</p>
                      </div>
                    </div>
                    <div className="h-4 bg-white/40 dark:bg-slate-600/40 rounded-2xl overflow-hidden backdrop-blur-xl">
                      <div 
                        className="h-full bg-gradient-to-r from-fitness-emerald-500 to-fitness-navy-500 rounded-2xl shadow-lg animate-pulse group-hover:animate-none"
                        style={{ width: `${Math.min((meal.calories / dietPlan.calories) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Nutrition Summary */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid lg:grid-cols-4 gap-8 text-center"
            >
              <div className="p-12 bg-gradient-to-br from-fitness-navy-600 to-fitness-emerald-500 text-white rounded-4xl shadow-2xl fitness-glow group hover:shadow-glow-energy">
                <div className="text-6xl mb-6">⚖️</div>
                <h4 className="text-3xl font-black mb-6">Perfect Balance</h4>
                <p className="text-2xl opacity-90">Macros optimized for your goals</p>
              </div>
              <div className="p-12 bg-gradient-to-br from-fitness-emerald-500 to-green-600 text-white rounded-4xl shadow-2xl fitness-glow group hover:shadow-glow-success">
                <div className="text-6xl mb-6">⚡</div>
                <h4 className="text-3xl font-black mb-6">Energy Boost</h4>
                <p className="text-2xl opacity-90">Steady energy all day long</p>
              </div>
              <div className="p-12 bg-gradient-to-br from-fitness-amber-500 to-orange-500 text-white rounded-4xl shadow-2xl fitness-glow group hover:shadow-glow-energy">
                <div className="text-6xl mb-6">🎯</div>
                <h4 className="text-3xl font-black mb-6">Goal Locked</h4>
                <p className="text-2xl opacity-90">100% aligned with target</p>
              </div>
              <div className="p-12 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-4xl shadow-2xl fitness-glow group hover:shadow-glow-primary">
                <div className="text-6xl mb-6">🤖</div>
                <h4 className="text-3xl font-black mb-6">AI Certified</h4>
                <p className="text-2xl opacity-90">Machine learning optimized</p>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Diet;
