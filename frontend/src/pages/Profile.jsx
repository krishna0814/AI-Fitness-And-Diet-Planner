import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Save, Edit3, Ruler, TrendingUp, Zap, Award, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    goal: 'loss'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        height: user.profile.height || '',
        weight: user.profile.weight || '',
        age: user.profile.age || '',
        gender: user.profile.gender || 'male',
        goal: user.profile.goal || 'loss'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated! 🎉');
      setIsEditing(false);
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (!formData.weight || !formData.height) return null;
    const heightM = formData.height / 100;
    return (formData.weight / (heightM * heightM)).toFixed(1);
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? (bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese') : null;
  const bmiColor = bmiCategory === 'normal' ? 'emerald' : bmiCategory === 'underweight' ? 'blue' : bmiCategory === 'overweight' ? 'amber' : 'red';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-400 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 max-w-4xl"
    >
      {/* Header */}
      <div className="space-y-4">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-black text-slate-900 dark:text-slate-100"
        >
          Profile Settings
        </motion.h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Update your information for personalized recommendations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* BMI Card */}
        <motion.div 
          className="fitness-card p-8 h-full"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl ${bmiColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' : bmiColor === 'blue' ? 'bg-blue-100 text-blue-700' : bmiColor === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              <Ruler className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">BMI</p>
              <p className="text-4xl font-black text-slate-900">
                {bmi || '--'}
              </p>
            </div>
          </div>
          {bmi && (
            <div className={`px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-2 ${
              bmiColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' : 
              bmiColor === 'blue' ? 'bg-blue-100 text-blue-800' : 
              bmiColor === 'amber' ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {bmiCategory.charAt(0).toUpperCase() + bmiCategory.slice(1)}
            </div>
          )}
        </motion.div>

        {/* Goal Card */}
        <motion.div 
          className="fitness-card p-8 h-full"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Goal</p>
              <p className="text-4xl font-black text-slate-900 capitalize">{formData.goal}</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Plans adapt automatically</p>
        </motion.div>

        {/* Consistency Card */}
        <motion.div 
          className="fitness-card p-8 h-full"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Consistency</p>
              <p className="text-4xl font-black text-slate-900">92%</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <motion.div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: '92%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Profile Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Personal Information</h2>
          <button
            onClick={() => isEditing ? handleSubmit(event) : setIsEditing(!isEditing)}
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              isEditing 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl' 
                : 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-400 bg-white shadow-sm'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <div>
            <label className="block text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Full Name</label>
            <input
              type="text"
              className="w-full p-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl text-lg font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-4 ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Height (cm)</label>
            <input
              type="number"
              min="100"
              max="250"
              className="w-full p-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl text-lg font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-4 ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              disabled={!isEditing}
              placeholder="180"
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Weight (kg)</label>
            <input
              type="number"
              min="30"
              max="300"
              className="w-full p-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl text-lg font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-4 ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              disabled={!isEditing}
              placeholder="75"
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Age</label>
            <input
              type="number"
              min="16"
              max="100"
              className="w-full p-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl text-lg font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-4 ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              disabled={!isEditing}
              placeholder="25"
            />
          </div>

          <div className="lg:col-span-2">
            {isEditing ? (
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-fitness-navy-600 hover:from-emerald-700 hover:to-fitness-navy-700 text-white font-black py-6 px-12 rounded-3xl text-xl shadow-2xl hover:shadow-glow-energy transition-all flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Update Profile
                  </>
                )}
              </motion.button>
            ) : null}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Profile;

