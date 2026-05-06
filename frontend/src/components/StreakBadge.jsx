import { motion } from 'framer-motion';
import { Activity, Flame } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter.jsx';




const StreakBadge = ({ days = 14 }) => (
  <motion.div 
    className="relative inline-flex items-center p-4 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-orange-500 text-white shadow-2xl fitness-glow group hover:shadow-glow-energy transition-all duration-500 hover:scale-105"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.05 }}
  >
    <motion.div 
      className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-orange-400 rounded-3xl blur opacity-75 animate-pulse"
      animate={{ 
        background: ['linear-gradient(to right, #10B981, #F59E0B)', 'linear-gradient(to right, #F59E0B, #10B981)'],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <div className="relative z-10 flex items-center gap-3">
      <motion.div 
        className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl group-hover:rotate-12 transition-transform duration-700"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Flame className="w-6 h-6 text-yellow-300 drop-shadow-lg" />
      </motion.div>
      <div>
        <div className="text-2xl font-black leading-tight">
<AnimatedCounter from={0} to={days} />+
        </div>
        <div className="text-sm font-bold uppercase tracking-wide opacity-90">Day Streak</div>
      </div>
    </div>
    <motion.div 
      className="ml-2 w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-ping"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    />
  </motion.div>
);

export default StreakBadge;

