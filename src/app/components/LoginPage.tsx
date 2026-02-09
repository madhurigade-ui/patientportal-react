import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, Users, Moon, Sun, Info } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { useDarkMode } from '@/app/components/DarkModeContext';
import { useAuthStore, usePatientStore } from '@/stores';
import {
  validatePhoneNumber,
  validateDOB,
  patientLookup,
  saveRememberMe,
  loadRememberMe,
} from '@/services/authService';
import { clearTokens, fetchAppConfig, AppConfig } from '@/services/apiClient';

export function LoginPage() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  // Zustand auth store
  const { setPhone, setPatientId, setPendingPatients, setLoading, isLoading, logout } = useAuthStore();
  const { clearPatientData } = usePatientStore();

  // Clear stale session data, load config, and load remembered phone on mount
  useEffect(() => {
    // Clear any stale session data to ensure fresh login
    clearTokens();
    sessionStorage.removeItem('patientId');
    sessionStorage.removeItem('idToken');

    // Clear persisted stores to remove old patient data
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('patient-storage');
    clearPatientData();
    logout();

    // Fetch app config (logo, clinic name, etc.)
    fetchAppConfig().then((config) => {
      if (config) {
        setAppConfig(config);
      }
    });

    // Load remembered phone number
    const rememberedPhone = loadRememberMe();
    if (rememberedPhone) {
      setPhoneNumber(rememberedPhone);
      setRememberMe(true);
    }
  }, []);

  // Get logo URL with fallback
  const getLogoUrl = (): string => {
    if (appConfig?.logo_url) {
      const trimmedUrl = appConfig.logo_url.trim();
      if (
        trimmedUrl &&
        (trimmedUrl.startsWith('http://') ||
          trimmedUrl.startsWith('https://') ||
          trimmedUrl.startsWith('assets/') ||
          trimmedUrl.startsWith('/'))
      ) {
        return trimmedUrl;
      }
    }
    return '/client-logo.png';
  };

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/client-logo.png';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      setError(phoneValidation.error || 'Invalid phone number');
      return;
    }

    // Validate date of birth
    const dobValidation = validateDOB(dateOfBirth);
    if (!dobValidation.valid) {
      setError(dobValidation.error || 'Invalid date of birth');
      return;
    }

    setLoading(true);

    try {
      // Look up patient in database
      const result = await patientLookup(phoneNumber, dateOfBirth);

      if (!result.success) {
        setError(result.error || 'Patient not found');
        setLoading(false);
        return;
      }

      // Store phone number in auth store
      setPhone(phoneValidation.formatted);

      // Save remember me preference
      if (rememberMe) {
        saveRememberMe(phoneValidation.formatted);
      }

      // Handle single or multiple patient matches
      if (result.patients.length === 1) {
        // Single patient found - proceed to OTP
        setPatientId(result.patients[0].id);
        setLoading(false);
        navigate('/verify-otp');
      } else {
        // Multiple patients found - store for name verification
        setPendingPatients(result.patients);
        setLoading(false);
        navigate('/verify-name');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const clinicName = appConfig?.displayName || appConfig?.name || 'Patient Portal';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4 py-8">
      {/* Theme Toggle - Fixed top right */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2.5 rounded-full bg-surface dark:bg-gray-800 shadow-md border border-border hover:shadow-lg transition-all"
        title={darkMode ? 'Light Mode' : 'Dark Mode'}
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <div className="w-full max-w-[420px]">
        {/* Login Card */}
        <div className="bg-surface dark:bg-gray-900 rounded-2xl shadow-xl border border-border p-8 transition-shadow hover:shadow-2xl">
          {/* Header with Logo */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src={getLogoUrl()}
              alt={clinicName}
              onError={handleImageError}
              className="w-14 h-14 object-contain rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">{clinicName}</h1>
              <p className="text-sm text-muted-foreground">Patient Portal</p>
            </div>
          </div>

          {/* Context Info */}
          <p className="text-center text-muted-foreground mb-6">
            Login to access your patient portal
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-11 h-12 text-base border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-medium">
                Date of Birth
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="pl-11 h-12 text-base border-2 focus:border-primary"
                />
              </div>
            </div>

            {error && (
              <div className="text-error text-sm bg-error/10 p-3 rounded-lg border border-error/20">
                {error}
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer select-none flex-1"
              >
                Remember Me
              </label>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Your login will be remembered on this device"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            {/* Sign Up Section */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="text-muted-foreground text-sm">New patient?</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/signup')}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Sign Up
              </Button>
            </div>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
            </div>

            {/* Clinic View */}
            <button
              type="button"
              onClick={() => navigate('/kiosk')}
              className="w-full flex items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 border border-border text-sm font-medium"
            >
              <Users className="w-5 h-5" />
              <span>Clinic View</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-muted-foreground text-sm">
            Powered by <span className="font-medium">TensorLinks</span> - AI for Healthcare
          </p>
          <div className="flex items-center justify-center gap-4 text-muted-foreground text-xs">
            <button className="hover:text-primary transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">Help Center</button>
          </div>
        </div>
      </div>
    </div>
  );
}
