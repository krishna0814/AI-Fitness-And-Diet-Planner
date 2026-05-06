import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield, Users, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch {
      toast.error('Invalid credentials. Try demo account.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: '50K', label: 'Active Users', icon: Users },
    { value: '95%', label: 'Success Rate', icon: Award },
    { value: '24/7', label: 'AI Support', icon: Zap },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 to-fitness-navy-900">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fitness-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-fitness-navy-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row gap-12 items-center lg:items-stretch"
      >
        {/* Main Login Card */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-1/2 lg:max-w-md"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-4xl p-12 shadow-2xl fitness-glow hover:shadow-glow-primary transition-all">
            <div className="text-center mb-14">
              <div className="w-32 h-32 bg-gradient-to-br from-fitness-navy-500 via-fitness-emerald-500 to-fitness-amber-400 text-white rounded-4xl flex items-center justify-center mx-auto mb-8 shadow-2xl fitness-glow animate-bounce-glow">
                <Shield className="w-16 h-16" />
              </div>
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-black bg-gradient-to-r from-fitness-navy-600 to-fitness-emerald-500 bg-clip-text text-transparent mb-4"
              >
                Welcome Back
              </motion.h1>
              <p className="text-xl text-muted-foreground font-semibold">Secure login for your fitness journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-semibold mb-4 flex items-center text-fitness-navy-700 dark:text-fitness-emerald-300">
                  <Mail className="w-6 h-6 mr-3" />
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-fitness-navy-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="john@fitnessai.com"
                    className="w-full pl-16 pr-5 py-6 bg-white/50 dark:bg-slate-700/50 border-2 border-border/50 rounded-3xl focus:ring-4 ring-fitness-navy-500/30 focus:border-fitness-navy-400 transition-all text-lg placeholder:text-muted-foreground font-semibold shadow-inner hover:shadow-md"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4 flex items-center text-fitness-navy-700 dark:text-fitness-emerald-300">
                  <Lock className="w-6 h-6 mr-3" />
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-fitness-navy-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full pl-16 pr-5 py-6 bg-white/50 dark:bg-slate-700/50 border-2 border-border/50 rounded-3xl focus:ring-4 ring-fitness-navy-500/30 focus:border-fitness-navy-400 transition-all text-lg placeholder:text-muted-foreground font-semibold shadow-inner hover:shadow-md"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-fitness-navy-600 to-fitness-emerald-500 hover:from-fitness-navy-700 hover:to-fitness-emerald-600 text-white py-8 px-12 rounded-4xl font-black text-2xl flex items-center justify-center space-x-4 shadow-2xl fitness-glow hover:shadow-glow-energy transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-2xl animate-spin group-hover:animate-spin-faster" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Enter FitnessAI</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center space-y-4">
              <button
                onClick={() => {
                  setFormData({ email: 'demo@fitnessai.com', password: 'demo123' });
                  setShowDemo(!showDemo);
                }}
                className="text-fitness-navy-600 dark:text-fitness-emerald-400 font-bold hover:underline flex items-center justify-center mx-auto text-lg transition-all"
              >
                🎮 Try Demo Account
              </button>
              {showDemo && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-fitness-navy-50 dark:bg-fitness-emerald-900/20 p-4 rounded-3xl border border-fitness-navy-200/50 text-sm"
                >
                  <p className="font-mono bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-2xl">
                    Email: <span className="font-bold text-fitness-navy-600">demo@fitnessai.com</span>
                  </p>
                  <p className="font-mono bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-2xl mt-2">
                    Password: <span className="font-bold text-destructive">demo123</span>
                  </p>
                </motion.div>
              )}
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="font-black hover:text-fitness-navy-600 dark:hover:text-fitness-emerald-400 transition-colors">
                  Create Free Account →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Sidebar */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-1/2 lg:max-w-sm hidden lg:block"
        >
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-10 rounded-4xl border border-white/30 shadow-2xl fitness-glow sticky top-20">
            <h3 className="text-2xl font-black mb-8 text-center bg-gradient-to-r from-fitness-navy-600 to-fitness-emerald-400 bg-clip-text text-transparent">
              Trusted By
            </h3>
            <div className="space-y-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center space-x-4 p-6 bg-white/50 dark:bg-slate-700/50 rounded-3xl hover:bg-white hover:shadow-glow-success transition-all"
                >
                  <div className="p-3 bg-gradient-to-br from-fitness-navy-500 to-fitness-emerald-400 text-white rounded-2xl fitness-glow flex-shrink-0">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-fitness-navy-600 dark:text-fitness-emerald-400">{stat.value}</div>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
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

export default Login;
