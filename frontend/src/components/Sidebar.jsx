import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  BarChart3, 
  Dumbbell, 
  Apple, 
  Moon, 
  Sun, 
  LogOut,
  X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Sidebar = ({ onToggleMobile }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-fitness-navy-500' },
    { path: '/profile', icon: User, label: 'Profile', color: 'text-fitness-emerald-500' },
    { path: '/diet', icon: Apple, label: 'Diet', color: 'text-fitness-amber-500' },
    { path: '/workout', icon: Dumbbell, label: 'Workout', color: 'text-fitness-navy-500' },
    { path: '/progress', icon: BarChart3, label: 'Progress', color: 'text-fitness-emerald-500' },
  ];

  return (
    <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-screen p-6 flex flex-col transition-all duration-500 ${isCollapsed ? 'w-24' : 'w-72'} border-r border-slate-200/50 dark:border-slate-700/50 shadow-2xl fitness-glow`}>
      {/* Mobile close button */}
      <motion.button 
        className="lg:hidden mb-6 p-4 rounded-3xl bg-gradient-to-r from-slate-100/80 to-slate-200 hover:from-slate-200 hover:to-slate-300 dark:from-slate-800/80 dark:to-slate-700 shadow-lg hover:shadow-glow-primary transition-all absolute top-6 -right-12 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={onToggleMobile}
      >
        <X className="w-7 h-7" />
      </motion.button>

      {/* Logo Area */}
      <div className="flex items-center mb-10 pb-6 border-b border-border/50">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3 rounded-2xl hover:bg-accent/80 transition-all group"
          aria-label="Toggle sidebar"
        >
          <svg className={`w-6 h-6 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {!isCollapsed && (
          <div className="ml-4 space-y-1">
            <div className="text-2xl font-black bg-gradient-to-r from-fitness-navy-600 via-fitness-emerald-500 to-fitness-amber-500 bg-clip-text text-transparent">
              FitnessAI
            </div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">AI Coach</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mb-10 space-y-2">
        {navItems.map(({ path, icon: Icon, label, color }, index) => (
          <Link
            key={path}
            to={path}
            className={`group flex items-center p-4 rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-primary/10 hover:shadow-glow-primary hover:-translate-x-1 hover:scale-[1.02] border-2 border-transparent hover:border-fitness-navy-200/50 ${location.pathname === path 
              ? 'bg-gradient-to-r from-fitness-navy-500 to-fitness-emerald-400 text-white shadow-glow-primary border-fitness-navy-200/50 scale-[1.02] translate-x-1' 
              : 'text-foreground/70 hover:text-foreground'
            }`}
            aria-current={location.pathname === path ? 'page' : undefined}
          >
            <Icon className={`w-6 h-6 mr-4 flex-shrink-0 transition-colors ${location.pathname === path ? 'drop-shadow-lg' : color}`} />
            {!isCollapsed && <span className="font-semibold tracking-wide whitespace-nowrap">{label}</span>}
            {location.pathname === path && (
              <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse-metric" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-8 border-t border-border/50">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center p-4 rounded-2xl hover:bg-gradient-to-r hover:from-accent/70 hover:to-muted hover:shadow-glow-primary hover:scale-[1.02] transition-all group border border-transparent hover:border-border"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-6 h-6 mr-4 text-amber-500/80 group-hover:text-amber-400" />
          ) : (
            <Moon className="w-6 h-6 mr-4 text-slate-500/80 group-hover:text-slate-400" />
          )}
          {!isCollapsed && <span className="font-semibold">{isDark ? 'Light' : 'Dark'} Mode</span>}
        </button>
        
        <button 
          onClick={logout}
          className="w-full flex items-center p-4 rounded-2xl bg-gradient-to-r from-destructive/10 to-destructive/20 hover:from-destructive/20 hover:to-destructive/30 text-destructive hover:text-destructive-foreground border border-destructive/20 hover:shadow-glow-primary hover:scale-[1.02] transition-all group"
        >
          <LogOut className="w-6 h-6 mr-4" />
          {!isCollapsed && <span className="font-semibold whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

