import { motion } from 'framer-motion';

const BlobBackground = () => (
  <div className="fixed inset-0 opacity-20 pointer-events-none z-0 overflow-hidden">
    <motion.div 
      className="absolute top-20 left-20 w-72 h-72 md:w-96 md:h-96 bg-fitness-emerald-400/40 rounded-full mix-blend-multiply filter blur-xl"
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 20, 0],
        y: [0, -10, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div 
      className="absolute top-80 right-20 w-72 h-72 md:w-96 md:h-96 bg-fitness-amber-400/40 rounded-full mix-blend-multiply filter blur-xl"
      animate={{
        scale: [1, 1.1, 1],
        x: [0, -20, 0],
        y: [0, 10, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
    />
    <motion.div 
      className="absolute -bottom-8 left-40 w-72 h-72 md:w-96 md:h-96 bg-fitness-navy-400/40 rounded-full mix-blend-multiply filter blur-xl"
      animate={{
        scale: [1, 1.3, 1],
        x: [0, 15, 0],
        y: [0, 20, 0],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
    />
  </div>
);

export default BlobBackground;

