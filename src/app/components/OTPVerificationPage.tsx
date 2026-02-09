import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/app/components/ui/input-otp';
import { useAuthStore, usePatientStore, useClinicStore, useAppointmentStore } from '@/stores';
import { exchangeToken } from '@/services/authService';
import {
  sendOTPFirebase,
  verifyOTPFirebase,
  clearRecaptcha,
} from '@/config/firebase';

export function OTPVerificationPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Ref for recaptcha container
  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Zustand stores
  const { phone, patientId, setOtpVerified, setTokens, setUser } = useAuthStore();
  const { fetchPatientData } = usePatientStore();
  const { fetchClinicInfo } = useClinicStore();
  const { fetchAppointments } = useAppointmentStore();

  // Auto-send OTP on mount
  useEffect(() => {
    if (phone && !otpSent) {
      handleSendOtp();
    }

    // Cleanup recaptcha on unmount
    return () => {
      clearRecaptcha();
    };
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0 && otpSent) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, otpSent]);

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Phone number not found. Please go back and try again.');
      return;
    }

    setIsSendingOtp(true);
    setError('');

    try {
      const result = await sendOTPFirebase(phone, 'recaptcha-container');

      if (!result.success) {
        setError(result.error || 'Failed to send verification code');
        setIsSendingOtp(false);
        return;
      }

      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
      setIsSendingOtp(false);
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      setIsSendingOtp(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    setError('');

    try {
      // Verify OTP with Firebase
      const otpResult = await verifyOTPFirebase(otp);

      if (!otpResult.success) {
        setError(otpResult.error || 'Invalid verification code');
        setIsVerifying(false);
        return;
      }

      // Check if we have a patient ID
      if (!patientId) {
        setError('Session expired. Please login again.');
        setIsVerifying(false);
        navigate('/login');
        return;
      }

      // Store Firebase ID token
      sessionStorage.setItem('idToken', otpResult.idToken || '');

      // Exchange token for access tokens
      const tokenResult = await exchangeToken(patientId, otpResult.idToken || '');

      if (!tokenResult.success) {
        setError(tokenResult.error || 'Authentication failed');
        setIsVerifying(false);
        return;
      }

      // Set authentication state
      setOtpVerified(true);
      setTokens(tokenResult.accessToken || '', tokenResult.refreshToken || '');

      // Fetch patient data first to get real user info
      await fetchPatientData(patientId);

      // Get the fetched patient profile from the store
      const patientProfile = usePatientStore.getState().profile;

      // Set user with actual patient data
      setUser({
        id: patientId,
        firstName: patientProfile?.firstName || 'Patient',
        lastName: patientProfile?.lastName || 'User',
        phone: patientProfile?.phone || phone || '',
        email: patientProfile?.email || '',
        dateOfBirth: patientProfile?.dateOfBirth || '',
      });

      // Fetch remaining data in parallel
      await Promise.all([
        fetchClinicInfo('clinic-1'),
        fetchAppointments(patientId),
      ]);

      navigate('/dashboard/summary');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !phone) return;
    setError('');
    setOtp('');

    await handleSendOtp();
  };

  const handleBack = () => {
    clearRecaptcha();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" ref={recaptchaRef}></div>

      <div className="w-full max-w-md">
        {/* Header - Outside card */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-primary dark:text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Verify Your Phone</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Secure your account with OTP</p>
        </div>

        {/* Clean Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            {/* OTP Code Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                  {otpSent
                    ? `Code sent to ${phone || 'your phone'}`
                    : isSendingOtp
                      ? 'Sending verification code...'
                      : 'Ready to send verification code'}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {otpSent
                    ? 'Please check your phone for the verification code'
                    : 'We will send a verification code to your phone'}
                </p>
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <label className="text-gray-700 dark:text-gray-300 font-medium block text-center text-sm">
                Enter Verification Code
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={!otpSent}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 rounded-md" />
                    <InputOTPSlot index={1} className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 rounded-md" />
                    <InputOTPSlot index={2} className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 rounded-md" />
                    <InputOTPSlot index={3} className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 rounded-md" />
                    <InputOTPSlot index={4} className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 rounded-md" />
                    <InputOTPSlot index={5} className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 rounded-md" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-error text-sm bg-error/10 p-3 rounded-lg border border-error/20 text-center">
                {error}
              </div>
            )}

            {/* Resend Code with Timer */}
            <div className="text-center">
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="text-sm text-primary dark:text-primary hover:underline font-medium disabled:opacity-50"
                >
                  {isSendingOtp ? 'Sending...' : 'Send Verification Code'}
                </button>
              ) : canResend ? (
                <button
                  onClick={handleResend}
                  className="text-sm text-primary dark:text-primary hover:underline font-medium"
                >
                  Didn't receive code? Resend
                </button>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Resend code in <span className="font-medium text-primary dark:text-primary">{resendTimer}s</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleVerify}
                disabled={otp.length !== 6 || isVerifying || !otpSent}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Powered by TensorLinks - AI for Healthcare
          </p>
        </div>
      </div>
    </div>
  );
}
