import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  History,
  ClipboardList,
  Shield,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Smile,
  User,
  FileText,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { useDarkMode } from '@/app/components/DarkModeContext';
import { useAuthStore, usePatientStore, useAppointmentStore, useDocumentStore } from '@/stores';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Zustand stores
  const { user, logout } = useAuthStore();
  const { clearPatientData } = usePatientStore();
  const { clearAppointments } = useAppointmentStore();
  const { clearDocuments } = useDocumentStore();

  const navItems = [
    { path: '/dashboard/summary', label: 'Summary', icon: Home },
    { path: '/dashboard/account-history', label: 'Account History', icon: History },
    { path: '/dashboard/treatment-plans', label: 'Treatment Plans', icon: ClipboardList },
    { path: '/dashboard/insurance', label: 'Insurance', icon: Shield },
    { path: '/my-documents', label: 'Documents', icon: FileText },
  ];

  const handleLogout = () => {
    // Clear all stores on logout
    logout();
    clearPatientData();
    clearAppointments();
    clearDocuments();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Navigation Bar - Solid Purple like AI-Assist */}
      <header className="bg-primary dark:bg-primary text-white px-2 sm:px-4 py-2 flex items-center justify-between shadow-lg relative z-50">
        {/* Left - Logo and Nav */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard/summary')}
            className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-base font-semibold hidden sm:block">Bright Smile Dental</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 ml-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate('/profile-manage')}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-white/20">
            <button
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Profile"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-sm hidden sm:block">{user?.firstName || 'Patient'}</span>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm hidden lg:inline">Logout</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary dark:bg-primary border-t border-white/10">
          <div className="px-2 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
