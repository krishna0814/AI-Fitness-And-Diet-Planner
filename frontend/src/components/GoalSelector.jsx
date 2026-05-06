import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
 // Native select (no shadcn/react-select dependency)

import { Target } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GoalSelector = ({ className = '' }) => {
  const { user, updateProfile } = useAuth();
  const [goal, setGoal] = useState(user?.profile?.goal || 'loss');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGoal(user?.profile?.goal || 'loss');
  }, [user]);

  const handleGoalChange = async (newGoal) => {
    setLoading(true);
    try {
      await updateProfile({ goal: newGoal });
      toast.success(`Goal updated to ${newGoal.replace('_', ' ')}! 🎯`);
    } catch (error) {
      toast.error('Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  const goals = [
    { value: 'loss', label: 'Weight Loss', icon: '⚖️', desc: 'Fat burn & toning' },
    { value: 'gain', label: 'Muscle Gain', icon: '💪', desc: 'Bulk & strength' },
    { value: 'maintain', label: 'Maintenance', icon: '⚡', desc: 'Stay lean & fit' },
  ];

  return (
    <div className={`p-6 rounded-3xl bg-gradient-to-r from-fitness-emerald-500/10 to-fitness-navy-500/10 border border-fitness-emerald-200/50 backdrop-blur-xl shadow-lg ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-fitness-emerald-500/20 rounded-2xl">
          <Target className="w-6 h-6 text-fitness-emerald-500" />
        </div>
        <div>
          <h3 className="font-black text-xl">Training Goal</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Plans adapt automatically</p>
        </div>
      </div>
      <select 
        value={goal}
        onChange={(e) => handleGoalChange(e.target.value)}
        disabled={loading}
        className="w-full p-4 border-2 border-slate-200/50 hover:border-fitness-emerald-400 focus:ring-4 ring-fitness-emerald-400/50 focus:border-fitness-emerald-500 bg-white/70 dark:bg-slate-700/70 rounded-2xl text-lg font-semibold shadow-lg transition-all hover:shadow-glow-primary"
      >
        <option value="loss">⚖️ Weight Loss - Fat burn &amp; toning</option>
        <option value="gain">💪 Muscle Gain - Bulk &amp; strength</option>
        <option value="maintain">⚡ Maintenance - Stay lean &amp; fit</option>
      </select>
    </div>
  );

};

export default GoalSelector;

