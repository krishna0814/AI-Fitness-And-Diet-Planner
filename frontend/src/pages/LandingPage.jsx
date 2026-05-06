import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { 
  Dumbbell, 
  Apple, 
  Brain, 
  Smartphone, 
  Shield, 
  TrendingUp, 
  Users, 
  Award, 
  Zap 
} from 'lucide-react';

const StatsCounter = ({ value, suffix, label, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('animate');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      variants={{
        animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
      }}
      className="text-center group"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-fitness-navy-500 to-fitness-emerald-500 text-white p-5 rounded-3xl mx-auto mb-6 shadow-glow-primary group-hover:scale-110 transition-all duration-500 flex items-center justify-center">
        <Icon className="w-10 h-10" />
      </div>
      <motion.div 
        className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-fitness-navy-600 to-fitness-emerald-500 bg-clip-text text-transparent mb-3"
        animate={isInView ? { scale: [1, 1.05, 1] } : {}}
      >
        <motion.span
          animate={isInView ? {
            innerText: value.toLocaleString()
          } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="count"
        />
        {suffix}
      </motion.div>
      <p className="text-xl font-semibold text-muted-foreground tracking-wide">{label}</p>
    </motion.div>
  );
};

const LandingPage = () => {
  const [stats] = useState([
    { value: 50000, suffix: '+', label: 'Happy Users', icon: Users },
    { value: 95, suffix: '%', label: 'Success Rate', icon: Award },
    { value: 1000, suffix: '+', label: 'Plans Generated', icon: Zap },
    { value: 300, suffix: '+', label: 'Experts Trained', icon: Brain }
  ]);

  const features = [
    { icon: Brain, title: 'AI-Powered Precision', desc: 'ML regression models deliver personalized diet & workout plans based on BMI, goals & progress' },
    { icon: Dumbbell, title: 'Adaptive Workouts', desc: 'Home/gym adaptive plans with 95% adherence rate. Real-time progress adjustments' },
    { icon: Apple, title: 'Smart Nutrition', desc: 'Calorie-perfect veg/non-veg meals with macro optimization. Grocery list generation' },
    { icon: TrendingUp, title: 'Predictive Tracking', desc: 'Weight prediction charts with explainable AI. Goal timeline forecasts' },
    { icon: Shield, title: 'Medical Grade Security', desc: 'JWT auth, encrypted health data, GDPR compliant. Enterprise security standards' },
    { icon: Smartphone, title: 'Mobile-First Design', desc: 'PWA ready, offline sync, push notifications for workout reminders' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-fitness-navy-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-fitness-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-fitness-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-fitness-navy-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero */}
      <section className="relative pt-28 pb-24 px-6 md:px-12 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-fitness-navy-500 to-fitness-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-glow-primary hover:shadow-glow-energy transition-all">
            🚀 AI Fitness Revolution
          </div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-fitness-navy-600 via-fitness-emerald-500 to-fitness-amber-500 bg-clip-text text-transparent leading-tight mb-8"
          >
            Transform Your Body
            <span className="block text-transparent bg-gradient-to-r from-fitness-amber-500 to-orange-500 bg-clip-text drop-shadow-2xl">With AI Precision</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Your personal AI coach delivers{' '}
            <span className="font-black text-fitness-navy-600 dark:text-fitness-emerald-400">science-backed</span> 
            diet & workout plans. 95% user success rate.
          </motion.p>
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="btn-fitness btn-primary inline-flex items-center space-x-3 text-xl shadow-2xl fitness-glow hover:shadow-glow-energy px-12 py-6 font-black"
              >
                <span>Start Free Trial</span>
                <Zap className="w-6 h-6" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/login"
                className="border-3 border-fitness-navy-200 dark:border-fitness-emerald-400 text-fitness-navy-700 dark:text-fitness-emerald-300 hover:bg-fitness-navy-50 dark:hover:bg-fitness-navy-900/50 px-12 py-6 rounded-3xl font-black text-xl transition-all fitness-glow"
              >
                Login Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {stats.map((stat, index) => (
              <StatsCounter key={index} {...stat} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-black text-center mb-24 bg-gradient-to-r from-gray-800 to-slate-700 bg-clip-text text-transparent"
          >
            Why Fitness<span className="text-fitness-emerald-500">AI</span>?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl p-10 rounded-4xl border border-white/30 hover:border-fitness-navy-200/50 hover:shadow-glow-success hover:-translate-y-4 transition-all duration-500 cursor-pointer shadow-2xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-fitness-navy-500 to-fitness-emerald-500 text-white p-5 rounded-3xl mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 fitness-glow">
                  <feature.icon className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-3xl font-black mb-6 text-center group-hover:text-fitness-navy-600 dark:group-hover:text-fitness-emerald-400 transition-colors">{feature.title}</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed text-center opacity-90">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-fitness-navy-600 via-fitness-emerald-500 to-fitness-amber-500 text-white p-20 rounded-4xl shadow-2xl fitness-glow">
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-7xl font-black mb-8 drop-shadow-2xl"
          >
            Ready to{' '}
            <span className="text-amber-200 drop-shadow-lg">Transform</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-12 opacity-95 max-w-2xl mx-auto leading-relaxed"
          >
            Join 50K+ fitness enthusiasts achieving their goals with cutting-edge AI.
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-flex space-x-6">
            <Link to="/register" className="btn-fitness btn-primary text-2xl px-16 py-8 shadow-2xl fitness-glow hover:shadow-glow-energy">
              Start Free Now
            </Link>
            <Link to="/login" className="text-xl font-bold px-16 py-8 border-3 border-white/80 hover:border-white rounded-3xl hover:bg-white/20 transition-all fitness-glow">
              Existing User
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/50 bg-gradient-to-t from-slate-50 dark:from-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-black bg-gradient-to-r from-fitness-navy-600 to-fitness-emerald-500 bg-clip-text text-transparent mb-6">
            FitnessAI
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            © 2024 FitnessAI. Built for BCA Major Project Excellence. Powered by advanced ML models.
          </p>
          <div className="flex justify-center space-x-8 text-muted-foreground text-lg">
            <Link to="/privacy" className="hover:text-fitness-navy-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-fitness-navy-600 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-fitness-navy-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
