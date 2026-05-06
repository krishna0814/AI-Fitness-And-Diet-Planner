import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Ruler, 
  Scale, 
  ArrowRight,
  Users, 
  TrendingUp, 
  Zap,
  Award 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profile: {
      name: '',
      age: '',
      gender: 'male',
      height: '',
      weight: '',
      goal: 'loss',
      preference: { diet: 'non-veg', workout: 'gym' }
    }
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
    } catch {
      // Error toast handled in context
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (!formData.profile.weight || !formData.profile.height) return null;
    const heightM = formData.profile.height / 100;
    return ((formData.profile.weight / (heightM * heightM)).toFixed(1));
  };

  const bmi = calculateBMI();

  const stats = [
    { value: '50K', label: 'Happy Users', icon: Users },
    { value: '7 Days', label: 'Free Trial', icon: TrendingUp },
    { value: '24/7', label: 'AI Coach', icon: Zap },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-fitness-navy-50 dark:from-slate-900 dark:to-fitness-navy-900">
        <div className="absolute top-32 left-20 w-96 h-96 bg-gradient-to-br from-fitness-emerald-400 to-fitness-amber-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-br from-fitness-navy-400 to-fitness-emerald-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-20 w-full max-w-6xl flex flex-col lg:flex-row gap-16 lg:items-center"
      >
        {/* Form Card */}
        <motion.div 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="w-full lg:w-2/3 lg:max-w-2xl"
        >
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 rounded-4xl p-12 shadow-2xl fitness-glow hover:shadow-glow-success transition-all">
            <div className="text-center mb-16">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-36 h-36 bg-gradient-to-br from-fitness-emerald-500 via-fitness-amber-500 to-fitness-navy-500 text-white rounded-4xl flex items-center justify-center mx-auto mb-10 shadow-2xl fitness-glow"
              >
                <User className="w-20 h-20" />
              </motion.div>
              <motion.h1 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-fitness-emerald-600 via-fitness-amber-500 to-fitness-navy-600 bg-clip-text text-transparent mb-6"
              >
                Join Fitness<span className="text-fitness-emerald-500 font-black drop-shadow-lg">AI</span>
              </motion.h1>
              <p className="text-2xl text-muted-foreground font-semibold">Start your transformation in under 2 minutes</p>
              <div className="flex justify-center mt-8">
                <div className="flex items-center text-sm text-fitness-navy-600 dark:text-fitness-emerald-400 font-bold">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping mr-2"></div>
                  Step {step} of 2
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-xl font-black mb-6 flex items-center text-fitness-navy-700 dark:text-fitness-emerald-300">
                      <Mail className="w-8 h-8 mr-4" />
                      Your Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-muted-foreground/70" />
                      <input
                        type="email"
                        placeholder="john.doe@fitnessai.com"
                        className="w-full pl-20 pr-6 py-8 bg-white/60 dark:bg-slate-700/60 border-2 border-border/40 rounded-4xl focus:ring-4 ring-fitness-emerald-500/40 focus:border-fitness-emerald-400 text-xl font-semibold shadow-xl transition-all placeholder:text-muted-foreground hover:shadow-lg"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xl font-black mb-6 flex items-center text-fitness-navy-700 dark:text-fitness-emerald-300">
                      <Lock className="w-8 h-8 mr-4" />
                      Secure Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-muted-foreground/70" />
                      <input
                        type="password"
                        placeholder="Create strong password"
                        className="w-full pl-20 pr-6 py-8 bg-white/60 dark:bg-slate-700/60 border-2 border-border/40 rounded-4xl focus:ring-4 ring-fitness-emerald-500/40 focus:border-fitness-emerald-400 text-xl font-semibold shadow-xl transition-all placeholder:text-muted-foreground hover:shadow-lg"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        minLength="8"
                        required
                      />
                    </div>
                  </div>

                  <motion.div 
                    className="flex items-center justify-between text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="flex items-center">
                      <input type="checkbox" className="w-5 h-5 accent-fitness-emerald-500 rounded mr-3" required />
                      <span>I agree to Terms & Privacy Policy</span>
                    </label>
                  </motion.div>

                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-fitness-emerald-600 to-fitness-navy-500 hover:from-fitness-emerald-700 hover:to-fitness-navy-600 text-white py-10 px-8 rounded-4xl font-black text-2xl flex items-center justify-center space-x-4 shadow-2xl fitness-glow hover:shadow-glow-energy transition-all"
                  >
                    <span>Continue to Profile →</span>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label className="block text-lg font-bold mb-4 flex items-center text-fitness-navy-700">
                        <User className="w-6 h-6 mr-3" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-6 py-5 border-2 border-border/50 rounded-3xl focus:ring-4 ring-fitness-emerald-400 focus:border-fitness-emerald-500 text-lg font-semibold bg-white/70 dark:bg-slate-700/70 shadow-lg transition-all"
                        value={formData.profile.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, name: e.target.value }
                        })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-bold mb-4 flex items-center text-fitness-navy-700">
                        <Ruler className="w-6 h-6 mr-3" />
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="175"
                        className="w-full px-6 py-5 border-2 border-border/50 rounded-3xl focus:ring-4 ring-fitness-emerald-400 focus:border-fitness-emerald-500 text-lg font-semibold bg-white/70 dark:bg-slate-700/70 shadow-lg transition-all"
                        value={formData.profile.height}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, height: e.target.value }
                        })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-bold mb-4 flex items-center text-fitness-navy-700">
                        <Scale className="w-6 h-6 mr-3" />
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        placeholder="80"
                        className="w-full px-6 py-5 border-2 border-border/50 rounded-3xl focus:ring-4 ring-fitness-emerald-400 focus:border-fitness-emerald-500 text-lg font-semibold bg-white/70 dark:bg-slate-700/70 shadow-lg transition-all"
                        value={formData.profile.weight}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, weight: e.target.value }
                        })}
                        required
                      />
                      {bmi && (
                        <p className="mt-2 text-sm font-semibold text-fitness-navy-600">
                          BMI: <span className={`font-black px-3 py-1 rounded-full bg-fitness-emerald-100 text-fitness-emerald-700 text-lg`}>{bmi}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-lg font-bold mb-4 text-fitness-navy-700">Fitness Goal</label>
                      <select
                        className="w-full px-6 py-5 border-2 border-border/50 rounded-3xl focus:ring-4 ring-fitness-emerald-400 focus:border-fitness-emerald-500 text-lg font-semibold bg-white/70 dark:bg-slate-700/70 shadow-lg transition-all"
                        value={formData.profile.goal}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, goal: e.target.value }
                        })}
                      >
                        <option value="loss">Weight Loss 🏃‍♂️</option>
                        <option value="gain">Muscle Gain 💪</option>
                        <option value="maintain">Body Toning ⚖️</option>
                        <option value="build">Strength Build 🏋️</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-fitness-emerald-600 via-fitness-amber-500 to-fitness-navy-500 hover:from-fitness-emerald-700 hover:to-fitness-navy-600 text-white py-10 px-8 rounded-4xl font-black text-2xl flex items-center justify-center space-x-4 shadow-2xl fitness-glow hover:shadow-glow-energy transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-3xl animate-spin" />
                        <span>Creating Your AI Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀 Launch My Journey</span>
                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </>
              )}

              <div className="text-center pt-12 border-t border-border/50">
                <p className="text-lg text-muted-foreground font-semibold">
                  Already a member?{' '}
                  <Link to="/login" className="font-black text-fitness-navy-600 dark:text-fitness-emerald-400 hover:underline transition-all">
                    Sign in →
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Stats Column */}
        <motion.div 
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          className="w-full lg:w-1/3 hidden lg:block"
        >
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-12 rounded-4xl border border-white/40 shadow-2xl fitness-glow sticky top-24">
            <h3 className="text-3xl font-black mb-12 text-center bg-gradient-to-r from-fitness-emerald-500 to-fitness-navy-500 bg-clip-text text-transparent">
              Why Join Today?
            </h3>
            <div className="space-y-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center p-6 bg-gradient-to-r from-white/50 to-emerald-50/50 dark:from-slate-700/50 dark:to-slate-600/30 rounded-3xl shadow-lg hover:shadow-glow-success hover:-translate-y-2 transition-all group"
                >
                  <div className="p-4 bg-gradient-to-br from-fitness-emerald-500 to-fitness-navy-400 text-white rounded-3xl fitness-glow flex-shrink-0 mr-6 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-black text-fitness-navy-600 dark:text-fitness-emerald-300 mb-1">{stat.value}</div>
                    <p className="text-lg text-muted-foreground font-semibold">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
