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
      preference: {
        diet: 'non-veg',
        workout: 'gym',
      },
    },
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await register(formData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (
      !formData.profile.weight ||
      !formData.profile.height
    ) {
      return null;
    }

    const heightM =
      formData.profile.height / 100;

    return (
      formData.profile.weight /
      (heightM * heightM)
    ).toFixed(1);
  };

  const bmi = calculateBMI();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-100">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-emerald-600 mb-4">
            Create Account
          </h1>

          <p className="text-gray-500 text-lg">
            Start your AI fitness journey
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* EMAIL */}
          <div>
            <label className="block text-lg font-bold mb-3">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                placeholder="john@gmail.com"
                className="w-full pl-14 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-lg font-bold mb-3">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="password"
                placeholder="********"
                className="w-full pl-14 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          {/* PROFILE SECTION */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* NAME */}
            <div>
              <label className="block text-lg font-bold mb-3">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-14 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.profile.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: {
                        ...formData.profile,
                        name: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* AGE */}
            <div>
              <label className="block text-lg font-bold mb-3">
                Age
              </label>

              <input
                type="number"
                placeholder="22"
                className="w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.profile.age}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: {
                      ...formData.profile,
                      age: e.target.value,
                    },
                  })
                }
                required
              />
            </div>

            {/* GENDER */}
            <div>
              <label className="block text-lg font-bold mb-3">
                Gender
              </label>

              <select
                className="w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.profile.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: {
                      ...formData.profile,
                      gender: e.target.value,
                    },
                  })
                }
              >
                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>
              </select>
            </div>

            {/* HEIGHT */}
            <div>
              <label className="block text-lg font-bold mb-3">
                Height (cm)
              </label>

              <div className="relative">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="number"
                  placeholder="175"
                  className="w-full pl-14 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.profile.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: {
                        ...formData.profile,
                        height: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* WEIGHT */}
            <div>
              <label className="block text-lg font-bold mb-3">
                Weight (kg)
              </label>

              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="number"
                  placeholder="70"
                  className="w-full pl-14 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.profile.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: {
                        ...formData.profile,
                        weight: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>

              {bmi && (
                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  BMI: {bmi}
                </p>
              )}
            </div>

            {/* GOAL */}
            <div>
              <label className="block text-lg font-bold mb-3">
                Goal
              </label>

              <select
                className="w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.profile.goal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: {
                      ...formData.profile,
                      goal: e.target.value,
                    },
                  })
                }
              >
                <option value="loss">
                  Weight Loss
                </option>

                <option value="gain">
                  Muscle Gain
                </option>

                <option value="maintain">
                  Maintain
                </option>

                <option value="build">
                  Strength Build
                </option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                Create Account
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </motion.button>

          {/* LOGIN */}
          <div className="text-center pt-4">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-600 font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;