import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Diet from './pages/Diet.jsx';
import Workout from './pages/Workout.jsx';
import Progress from './pages/Progress.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Menu } from 'lucide-react';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Sidebar - Fixed */}
      {isAuthenticated && (
        <div className="fixed left-0 top-0 h-full w-64 z-50 bg-white dark:bg-slate-800 shadow-2xl border-r border-slate-200 dark:border-slate-700">
          <Sidebar onToggleMobile={toggleSidebar} />
        </div>
      )}

      {/* Mobile Toggle Button */}
      {isAuthenticated && (
        <button 
          className="fixed top-6 left-6 z-60 lg:hidden p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border hover:shadow-2xl transition-all"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6 text-slate-800 dark:text-slate-200" />
        </button>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && isAuthenticated && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content - With Sidebar Offset */}
      <main className={`${isAuthenticated ? 'ml-64 lg:ml-64' : ''} flex-1 w-full min-h-screen transition-all p-6 md:p-8 lg:p-12`}>
        <div className="max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/diet" element={isAuthenticated ? <Diet /> : <Navigate to="/login" replace />} />
            <Route path="/workout" element={isAuthenticated ? <Workout /> : <Navigate to="/login" replace />} />
            <Route path="/progress" element={isAuthenticated ? <Progress /> : <Navigate to="/login" replace />} />
            
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

