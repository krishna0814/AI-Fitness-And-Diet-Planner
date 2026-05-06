import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Welcome back! 🎉');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Account created! Welcome aboard 🚀');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('http://localhost:5000/api/user/profile', { profile: profileData });
      setUser({ ...user, profile: profileData });
      toast.success('Profile updated successfully! ✅');
      return response.data;
    } catch (error) {
      toast.error('Profile update failed');
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    toast('Logged out successfully 👋');
    window.location.href = '/';
  }, []);


  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        const response = await axios.get('http://localhost:5000/api/auth/me');
        console.log('USER ME RESPONSE:', response.data);
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Check auth on mount and when token changes
  useEffect(() => {
    checkAuth();
  }, []);

  // Axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
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
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

