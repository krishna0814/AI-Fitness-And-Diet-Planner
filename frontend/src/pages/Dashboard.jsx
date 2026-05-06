import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  HeartPulse, 
  Scale, 
  Activity, 
  Target, 
  Sparkles, 
  Dumbbell,
  TrendingUp 
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
// NOTE: GoalSelector/StreakBadge imports kept only if used in the full dashboard.
// (They were previously present in the template; ESLint is currently not configured.)

import {
  Chart as ChartJS,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(Filler, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AnimatedCounter = ({ from, to, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(from);
  
  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (to - from) + from));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [from, to, duration]);

  return <span className="font-black text-3xl lg:text-4xl break-words">{count.toLocaleString()}{suffix}</span>;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [caloriesLoading, setCaloriesLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [bmi, setBmi] = useState(0);
  const [recommendations, setRecommendations] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    console.log('API CALLED ONCE - Dashboard');
    loadDashboardData();

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);

    // If user navigates back from Diet page (or localStorage updates), refresh calories.
    const refreshFromStorage = () => loadDashboardData();
    window.addEventListener('focus', refreshFromStorage);
    window.addEventListener('storage', refreshFromStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refreshFromStorage);
      window.removeEventListener('storage', refreshFromStorage);
    };
    // loadDashboardData is declared below; intentionally not in deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);



  const loadDashboardData = async () => {
    setLoading(true);
    setCaloriesLoading(true);

    console.log('USER DATA:', user);

    if (user?.profile?.weight && user?.profile?.height) {
      const heightM = user.profile.height / 100;
      const bmiValue = user.profile.weight / (heightM * heightM);
      if (Number.isFinite(bmiValue)) setBmi(bmiValue.toFixed(1));
    }

    try {
      // Prefer AI diet calories stored by the Diet page.
      // Fallback: backend calories from /api/auth/me.
      let safeCalories = 0;
      try {
        // Re-read every time so UI updates after Diet generation.
        const stored = localStorage.getItem('dietData');
        const diet = JSON.parse(stored || 'null');
        const dietCalories = diet?.calories;
        const parsedDiet = Number(dietCalories);
        if (Number.isFinite(parsedDiet) && parsedDiet > 0) safeCalories = parsedDiet;
      } catch (e) {
        // ignore
      }


      if (!safeCalories) {
        const backendCalories = user?.calories ?? user?.profile?.calories ?? 0;
        const parsedBackend = Number(backendCalories);
        safeCalories = Number.isFinite(parsedBackend) ? parsedBackend : 0;
      }

      setStats({
        weightTrend: -1.8,
        calorieAvg: Math.max(0, safeCalories),
        workoutConsistency: 92,
        streakDays: 14,
        goalProgress: 68,
      });


      setCaloriesLoading(false);
    } catch {
      setStats({
        weightTrend: -1.8,
        calorieAvg: 0,
        workoutConsistency: 92,
        streakDays: 14,
        goalProgress: 68,
      });
      setCaloriesLoading(true);
    }

    setRecommendations({
      diet: 'Increase protein 25g/day',
      workout: 'Add 2 HIIT sessions/week',
      prediction: 'Goal weight by May 15th',
      confidence: 87,
    });

    setLoading(false);
  };

  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'blue' };
    if (bmiValue < 25) return { label: 'Normal', color: 'emerald' };
    if (bmiValue < 30) return { label: 'Overweight', color: 'amber' };
    return { label: 'Obese', color: 'red' };
  };

  const category = getBmiCategory(parseFloat(bmi));

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [{
      data: [82.5, 81.2, 79.8, 78.5, 77.0],
      borderColor: '#1E3A8A',
      backgroundColor: 'rgba(30, 58, 138, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#10B981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 3
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-slate-600 text-white p-4 rounded-2xl shadow-lg">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div className="break-words">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-slate-800 to-emerald-500 bg-clip-text">
              Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.profile?.name?.split(' ')[0] || 'Athlete'}!
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 font-semibold">Your fitness journey</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* BMI Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all h-full"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl ${category.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : category.color === 'blue' ? 'bg-blue-100 text-blue-700' : category.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">BMI</p>
              <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1">{bmi}</p>
            </div>
          </div>
          <p className="text-lg font-bold px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-slate-100 inline-block">
            {category.label}
          </p>
        </motion.div>

        {/* Streak Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all h-full"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-xl text-white">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Streak</p>
              <AnimatedCounter from={0} to={stats.streakDays} suffix=" days" />
            </div>
          </div>
          <div className="text-3xl text-amber-500">🔥</div>
        </motion.div>

        {/* Goal Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all h-full"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Goal</p>
              <AnimatedCounter from={0} to={stats.goalProgress} suffix="%" />
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: `${stats.goalProgress}%` }} />
          </div>
        </motion.div>

        {/* Calorie Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all h-full"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Calories</p>
              {caloriesLoading ? (
                <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">Calculating...</span>
              ) : (
                <AnimatedCounter from={0} to={stats.calorieAvg} suffix=" kcal" />
              )}
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center">Daily average</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Dumbbell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Weight Journey
          </h3>
          <div className="h-[300px]">
            <Line data={chartData} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-600" />
            Weekly Activity
          </h3>
          <div className="h-[300px]">
            <Bar data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                label: 'Calories Burned',
                data: [420, 580, 650, 720, 810, 940, 680],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 4
              }]
            }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-2xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-500 rounded-3xl shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">AI Coach Insights</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Personalized recommendations</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Diet</h4>
            <p className="text-xl text-slate-700 dark:text-slate-200 font-semibold">Increase protein 25g/day for muscle recovery</p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Workout</h4>
            <p className="text-xl text-slate-700 dark:text-slate-200 font-semibold">Add 2 HIIT sessions/week + progressive overload</p>
          </div>
          <div className="p-8 md:col-span-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-slate-600 text-white shadow-2xl border border-emerald-200 hover:shadow-glow-primary hover:-translate-y-1 transition-all">
            <div className="text-5xl mb-6">🎯</div>
            <p className="text-2xl font-bold mb-4 drop-shadow-lg">Goal weight by May 15th</p>
            <p className="text-xl text-yellow-300 drop-shadow-lg">Confidence: 87%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

