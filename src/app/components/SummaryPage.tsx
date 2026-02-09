import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Smile,
  History,
  CalendarClock,
  X,
  CreditCard
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { useAppointments } from '@/app/components/AppointmentsContext';
import { fetchAppConfig, AppConfig, apiRequest } from '@/services/apiClient';
import { usePatientStore, useAuthStore } from '@/stores';
import { environment } from '@/config/environment';

// Account balance response type
interface AccountBalance {
  totalBalance: number;
  pendingBalance: number;
}

export function SummaryPage() {
  const navigate = useNavigate();
  const { appointments, cancelAppointment, updateAppointmentStatus } = useAppointments();
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Get patient data from stores
  const { profile } = usePatientStore();
  const { patientId } = useAuthStore();

  // Fetch app config and account balance on mount
  useEffect(() => {
    fetchAppConfig().then((config) => {
      if (config) {
        setAppConfig(config);
      }
    });

    // Fetch account balance
    if (patientId) {
      fetchAccountBalance();
    }
  }, [patientId]);

  // Fetch account balance from API
  const fetchAccountBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const { clientId } = environment;
      const response = await apiRequest<AccountBalance>(
        `/${clientId}/patients/${patientId}/balance`,
        { method: 'GET' }
      );
      setAccountBalance(response?.totalBalance || 0);
    } catch (error) {
      console.error('[SummaryPage] Error fetching balance:', error);
      setAccountBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  };

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

  // Split appointments into upcoming and past
  const now = new Date();
  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= now && apt.status !== 'missed';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate < now || apt.status === 'missed';
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatAppointmentDate = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(id);
    }
  };

  const handleConfirmAppointment = (id: string) => {
    updateAppointmentStatus(id, 'confirmed');
  };

  const handleRescheduleAppointment = (id: string) => {
    navigate('/schedule-appointment', { state: { rescheduleId: id } });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'scheduled':
        return (
          <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-400">
            <Calendar className="w-3 h-3" />
            Scheduled
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      case 'missed':
        return (
          <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
            <XCircle className="w-3 h-3" />
            Missed
          </span>
        );
      default:
        return null;
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {profile?.firstName || 'Patient'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your patient dashboard</p>
      </motion.div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/20 dark:to-blue-950/20 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Summary</h2>
            </div>
            
            <div className="text-center py-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Current Balance</p>
              {isLoadingBalance ? (
                <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">...</p>
              ) : (
                <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(accountBalance)}
                </p>
              )}
              {accountBalance > 0 ? (
                <Button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 mt-4 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-medium">Your account is paid in full. Thank you!</p>
                </div>
              )}
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              View Account Details
            </Button>
          </Card>
        </motion.div>

        {/* Clinic Info Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Smile className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Clinic</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <img
                  src={getLogoUrl()}
                  alt={appConfig?.displayName || appConfig?.name || 'Clinic Logo'}
                  onError={handleImageError}
                  className="w-16 h-16 object-contain rounded-lg"
                />
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white">
                {appConfig?.displayName || appConfig?.name || 'Your Clinic'}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {appConfig?.address || 'Address not available'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {appConfig?.phoneNumber || 'Phone not available'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {appConfig?.email || 'Email not available'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Appointments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Appointments</h2>
            </div>
            <Button 
              onClick={() => navigate('/schedule-appointment')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Appointment
            </Button>
          </div>

          {/* Upcoming Appointments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Appointments
              </h3>
              <span className="text-sm text-gray-500">{upcomingAppointments.length} appointments</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((apt, index) => {
                const { month, day } = formatAppointmentDate(new Date(apt.date));
                return (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex gap-4">
                      <div className="bg-purple-100 rounded-lg px-3 py-2 text-center flex-shrink-0 dark:bg-purple-900/30">
                        <p className="text-xs font-medium text-purple-600 uppercase dark:text-purple-400">{month}</p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{day}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-gray-900 dark:text-white">{apt.time}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{apt.duration}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{apt.type}</p>
                        <div className="flex items-center gap-2 mb-3">
                          {getStatusBadge(apt.status)}
                          <span className="text-xs text-gray-500 dark:text-gray-400">Insurance: {apt.insurance}</span>
                        </div>
                        <div className="flex gap-2">
                          {apt.status === 'scheduled' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleConfirmAppointment(apt.id)}
                              className="flex-1 h-9 text-xs gap-1 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Confirm
                            </Button>
                          )}
                          {apt.status === 'cancelled' ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleRescheduleAppointment(apt.id)}
                                className="flex-1 h-9 text-xs gap-1 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                              >
                                <CalendarClock className="w-4 h-4" />
                                Reschedule
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="flex-1 h-9 text-xs gap-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleRescheduleAppointment(apt.id)}
                                className="flex-1 h-9 text-xs gap-1 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950"
                              >
                                <CalendarClock className="w-4 h-4" />
                                Reschedule
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="flex-1 h-9 text-xs gap-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Past Appointments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <History className="w-5 h-5" />
                Past Appointments
              </h3>
              <span className="text-sm text-gray-500">{pastAppointments.length} appointments</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pastAppointments.map((apt, index) => {
                const { month, day } = formatAppointmentDate(new Date(apt.date));
                return (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex gap-3">
                      <div className="bg-gray-200 rounded-lg px-2 py-1.5 text-center flex-shrink-0 h-fit dark:bg-gray-700">
                        <p className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">{month}</p>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{day}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm mb-1 dark:text-white">{apt.time}</p>
                        <p className="text-xs text-gray-600 mb-2 dark:text-gray-400">{apt.type}</p>
                        {getStatusBadge(apt.status)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}