import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { toast } from 'react-hot-toast';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem('token')
  );

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [loading, setLoading] = useState(true);

  // =========================
  // LOGIN
  // =========================

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API}/api/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const {
        token: newToken,
        user: userData,
      } = response.data;

      // SAVE TOKEN
      localStorage.setItem('token', newToken);

      // UPDATE STATE
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      // SET AXIOS HEADER
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${newToken}`;

      toast.success('Welcome back! 🎉');

      return response.data;
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Login failed'
      );

      throw error;
    }
  };

  // =========================
  // REGISTER
  // =========================

  const register = async (formData) => {
    try {
      const response = await axios.post(
        `${API}/api/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const {
        token: newToken,
        user: userData,
      } = response.data;

      // SAVE TOKEN
      localStorage.setItem('token', newToken);

      // UPDATE STATE
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      // SET AXIOS HEADER
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${newToken}`;

      toast.success(
        'Account created successfully 🚀'
      );

      return response.data;
    } catch (error) {
      console.error('REGISTER ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Registration failed'
      );

      throw error;
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(
        `${API}/api/user/profile`,
        {
          profile: profileData,
        }
      );

      setUser((prev) => ({
        ...prev,
        profile: profileData,
      }));

      toast.success(
        'Profile updated successfully ✅'
      );

      return response.data;
    } catch (error) {
      console.error(
        'PROFILE UPDATE ERROR:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Profile update failed'
      );

      throw error;
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(() => {
    localStorage.removeItem('token');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    delete axios.defaults.headers.common[
      'Authorization'
    ];

    toast.success('Logged out successfully 👋');

    window.location.href = '/login';
  }, []);

  // =========================
  // CHECK AUTH
  // =========================

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // SET TOKEN
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      const response = await axios.get(
        `${API}/api/auth/me`
      );

      console.log('AUTH USER:', response.data);

      setUser(response.data);

      setIsAuthenticated(true);
    } catch (error) {
      console.error(
        'AUTH CHECK ERROR:',
        error
      );

      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // =========================
  // RUN AUTH CHECK
  // =========================

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // =========================
  // SET AXIOS TOKEN
  // =========================

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common[
        'Authorization'
      ];
    }
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    updateProfile,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};