import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Target, Clock, HeartPulse, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const WorkoutPlans = [
  {
    id: 'fullbody',
    name: 'Full Body Burn',
    level: 'Beginner',
    duration: 45,
    calories: 450,
    muscleGroups: ['Full Body'],
    icon: '💪',
    exercises: [
      { name: 'Bodyweight Squats', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Push-ups', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Pull-ups/Rows', sets: 3, reps: '8-10', rest: '90s' },
      { name: 'Plank', sets: 3, reps: '30-45s', rest: '60s' }
    ]
  },
  {
    id: 'upperlower',
    name: 'Upper/Lower Split',
    level: 'Intermediate',
    duration: 60,
    calories: 580,
    muscleGroups: ['Upper', 'Lower'],
    icon: '🔥',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Deadlifts', sets: 4, reps: '6-8', rest: '120s' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '90s' },
      { name: 'Lunges', sets: 3, reps: '10/leg', rest: '60s' }
    ]
  },
  {
    id: 'power',
    name: 'Power Builder',
    level: 'Advanced',
    duration: 75,
    calories: 720,
    muscleGroups: ['Strength'],
    icon: '⚡',
    exercises: [
      { name: 'Squat 5x5', sets: 5, reps: '5', rest: '3min' },
      { name: 'Bench Press 5x5', sets: 5, reps: '5', rest: '3min' },
      { name: 'Deadlift 1x5', sets: 1, reps: '5', rest: '5min' },
      { name: 'Weighted Dips', sets: 4, reps: '8', rest: '2min' }
    ]
  }
];

const Workout = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(WorkoutPlans[0]);
  const [activeExercise, setActiveExercise] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0); // seconds elapsed
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [timerStatus, setTimerStatus] = useState('idle'); // idle|running|paused|completed

  // Start/Pause/Resume/Complete timer
  useEffect(() => {
    if (timerStatus !== 'running') return;

    const interval = setInterval(() => {
      setWorkoutTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStatus]);

  const formatTime = (totalSeconds) => {
    const mm = Math.floor(totalSeconds / 60);
    const ss = Math.max(0, totalSeconds % 60);
    return `${mm}:${String(ss).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timerStatus === 'completed') {
      setWorkoutTimer(0);
    }
    setTimerStatus('running');
    setIsWorkingOut(true);
  };

  const handlePause = () => {
    setTimerStatus('paused');
    setIsWorkingOut(false);
  };

  const handleResume = () => {
    setTimerStatus('running');
    setIsWorkingOut(true);
  };

  const handleComplete = () => {
    setTimerStatus('completed');
    setIsWorkingOut(false);
    setActiveExercise(0);
    setWorkoutTimer(0);
  };




  const bmi = user?.profile && user.profile.weight && user.profile.height 
    ? ((user.profile.weight / Math.pow(user.profile.height / 100, 2)).toFixed(1))
    : 0;

  const recommendedPlan = bmi > 25 ? WorkoutPlans[1] : WorkoutPlans[0];

  return (
    <div className="p-6 sm:p-8 md:p-10 lg:p-12 max-w-7xl mx-auto relative min-h-screen overflow-hidden">

      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50 to-fitness-navy-50">
        <div className="absolute top-1/2 left-20 w-[500px] h-[500px] bg-gradient-to-br from-fitness-navy-400/5 to-fitness-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-fitness-emerald-400/5 to-fitness-amber-400/5 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20"
      >
        {/* Hero Header */}
        <div className="flex items-center mb-24">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 bg-gradient-to-br from-fitness-navy-500 via-fitness-emerald-500 to-fitness-amber-500 text-white p-8 rounded-4xl mr-10 shadow-2xl fitness-glow flex-shrink-0"
          >
            <Dumbbell className="w-16 h-16 mx-auto" />
          </motion.div>
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-fitness-navy-600 via-fitness-emerald-500 to-fitness-amber-500 bg-clip-text text-transparent mb-6 leading-tight">
              AI Workout Lab
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-bold opacity-90">Intelligent training optimized for your body</p>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/50 fitness-glow text-center">
            <div className="text-6xl font-black text-fitness-emerald-600 mb-6">🔥</div>
            <div className="text-5xl font-black mb-2">{recommendedPlan.calories}kcal</div>
            <p className="text-2xl font-bold text-muted-foreground">Burn per Session</p>
          </div>
          <div className="p-10 bg-gradient-to-br from-fitness-navy-500 to-fitness-emerald-400 text-white rounded-4xl shadow-2xl fitness-glow text-center">
            <div className="text-6xl mb-6">⏱️</div>
            <div className="text-5xl font-black mb-2">{recommendedPlan.duration}min</div>
            <p className="text-2xl font-bold opacity-90">Optimal Duration</p>
          </div>
          <div className="p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/50 fitness-glow text-center">
            <div className="text-6xl font-black text-fitness-amber-500 mb-6">🏆</div>
            <div className="text-3xl font-bold">{recommendedPlan.level.toUpperCase()}</div>
            <p className="text-xl font-semibold text-muted-foreground">AI Recommended</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Plan Selector */}
          <motion.div 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-4xl p-12 shadow-2xl border border-white/40 fitness-glow"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-4xl font-black mb-12 text-fitness-navy-700 flex items-center">
              <Target className="w-12 h-12 mr-6" />
              Select Training Plan
            </h3>
            
            <div className="space-y-6">
              {WorkoutPlans.map((plan, index) => (
                <motion.button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-10 rounded-4xl border-4 transition-all shadow-2xl group overflow-hidden relative ${
                    selectedPlan.id === plan.id 
                      ? 'border-fitness-emerald-400 bg-gradient-to-r from-fitness-emerald-500/20 shadow-glow-success fitness-glow scale-102' 
                      : 'border-transparent hover:border-fitness-navy-200/50 hover:shadow-glow-primary bg-white/60 dark:bg-slate-700/60'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 from-fitness-emerald-500 to-fitness-navy-500" />
                  <div className="relative flex items-start space-x-6">
                    <div className={`p-6 rounded-3xl text-4xl font-black shadow-2xl flex-shrink-0 ${
                      selectedPlan.id === plan.id 
                        ? 'bg-gradient-to-br from-fitness-emerald-600 to-fitness-navy-500 text-white shadow-glow-success' 
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 dark:bg-slate-700 dark:text-gray-200'
                    }`}>
                      {plan.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-3xl font-black mb-4 group-hover:text-fitness-navy-600 dark:group-hover:text-fitness-emerald-400 transition-colors">
                        {plan.name}
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-left mb-6">
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl text-sm font-bold">
                          <Clock className="w-6 h-6 mx-auto mb-2 text-fitness-emerald-500" />
                          {plan.duration}min
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl text-sm font-bold">
                          <Zap className="w-6 h-6 mx-auto mb-2 text-fitness-amber-500" />
                          {plan.calories}kcal
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl text-sm font-bold">
                          <Award className="w-6 h-6 mx-auto mb-2 text-fitness-navy-500" />
                          {plan.level}
                        </div>
                      </div>
                      {selectedPlan.id === plan.id && (
                        <div className="flex items-center text-fitness-emerald-600 font-bold text-xl">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping mr-3"></div>
                          AI Recommended for you
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Workout Display */}
          <motion.div 
            className="lg:sticky lg:top-32 lg:self-start bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-4xl p-12 shadow-2xl border border-white/40 fitness-glow"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-4xl font-black mb-4 text-fitness-navy-700">{selectedPlan.name}</h3>
              <div className="flex flex-wrap justify-center gap-4 text-2xl font-bold mb-8">
                {selectedPlan.muscleGroups.map((group, i) => (
                  <motion.span 
                    key={i}
                    className="px-6 py-3 bg-gradient-to-r from-fitness-emerald-500/20 to-fitness-navy-500/20 text-fitness-emerald-600 rounded-3xl border border-fitness-emerald-300/50 font-black"
                    whileHover={{ scale: 1.05 }}
                  >
                    {group}
                  </motion.span>
                ))}
              </div>
              <div className="flex items-center justify-center text-3xl font-black gap-8 mb-12">
                <span className={`p-4 rounded-4xl shadow-lg ${isWorkingOut ? 'bg-red-500 text-white animate-pulse' : 'bg-fitness-emerald-100 text-fitness-emerald-700'}`}>
                  {selectedPlan.duration} min
                </span>
                <span className="p-4 rounded-4xl bg-fitness-amber-100 text-fitness-amber-700 shadow-lg">
                  ~{selectedPlan.calories} kcal
                </span>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-6">
              {selectedPlan.exercises.map((exercise, index) => (

                <motion.div
                  key={index}
                  className={`p-8 rounded-4xl border-4 transition-all shadow-xl group ${
                    activeExercise === index 
                      ? 'border-fitness-emerald-400 bg-gradient-to-r from-fitness-emerald-500/10 shadow-glow-success scale-105 fitness-glow' 
                      : 'border-transparent hover:border-fitness-navy-200/50 hover:shadow-2xl bg-white/60 dark:bg-slate-700/60'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`w-16 h-16 rounded-3xl font-black text-3xl flex items-center justify-center flex-shrink-0 shadow-2xl ${
                      activeExercise === index 
                        ? 'bg-gradient-to-br from-fitness-emerald-600 to-fitness-navy-500 text-white' 
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 dark:bg-slate-700 dark:text-gray-200'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <h4 className="text-3xl font-black mb-4 group-hover:text-fitness-navy-600 dark:group-hover:text-fitness-emerald-400 transition-colors">
                          {exercise.name}
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl font-bold text-fitness-navy-600">
                            {exercise.sets} sets
                          </div>
                          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl font-bold text-fitness-emerald-600">
                            {exercise.reps}
                          </div>
                          <div className={`p-4 rounded-2xl font-bold ${
                            activeExercise === index 
                              ? 'bg-gradient-to-r from-fitness-emerald-500 to-fitness-navy-500 text-white shadow-glow-success' 
                              : 'bg-white/50 dark:bg-slate-800/50 text-muted-foreground'
                          }`}>
                            {exercise.rest}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {activeExercise === index && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="mt-8 pt-8 border-t border-white/20"
                    >
                      <p className="text-xl text-muted-foreground mb-6 font-semibold italic">
                        Pro Tip: Focus on controlled reps. Rest fully between sets.
                      </p>
                      <div className="flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
onClick={() => (timerStatus === 'running' ? handlePause() : handleStart())}
                          className="bg-gradient-to-r from-fitness-emerald-600 to-fitness-navy-500 text-white font-black py-6 px-16 rounded-4xl shadow-2xl fitness-glow hover:shadow-glow-success transition-all text-xl"
                        >
                          {isWorkingOut ? 'Pause Workout ⏸️' : 'Start Workout ▶️'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {isWorkingOut && (
              <motion.div 
                className="mt-12 p-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-4 border-red-400/50 rounded-4xl text-center backdrop-blur-xl shadow-2xl fitness-glow"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-8xl mb-8 animate-pulse">⏱️</div>
                <div className="text-7xl font-black text-red-500 mb-12 drop-shadow-2xl">
                  {Math.floor(workoutTimer / 60)}:{(workoutTimer % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-3xl font-bold text-red-600 mb-12">Workout in Progress</p>
                <div className="text-4xl mb-8 animate-pulse">Keep Pushing! 💪</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setIsWorkingOut(false);
                    setActiveExercise(0);
                  }}
                  className="bg-white/30 backdrop-blur-xl hover:bg-white/50 text-red-900 font-black py-6 px-12 rounded-4xl text-2xl shadow-2xl border-2 border-white/50 hover:border-white transition-all"
                >
                  Complete & Log Workout
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Workout;
