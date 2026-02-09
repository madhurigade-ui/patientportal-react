// Name Verification Page - shown when multiple patients match phone + DOB
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useAuthStore } from '@/stores';
import { verifyPatientByName } from '@/services/authService';

export function NameVerificationPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Zustand auth store
  const { pendingPatients, setPatientId, phone } = useAuthStore();

  // Redirect to login if no pending patients
  if (!pendingPatients || pendingPatients.length === 0) {
    navigate('/login');
    return null;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!firstName.trim() || firstName.trim().length < 2) {
      setError('Please enter your first name (at least 2 characters)');
      return;
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      setError('Please enter your last name (at least 2 characters)');
      return;
    }

    setIsVerifying(true);

    try {
      // Verify name against pending patients
      const result = await verifyPatientByName(
        pendingPatients,
        firstName.trim(),
        lastName.trim()
      );

      if (!result.success || !result.patient) {
        setError(result.error || 'No matching account found. Please check your name and try again.');
        setIsVerifying(false);
        return;
      }

      // Set patient ID and proceed to OTP
      setPatientId(result.patient.id);
      setIsVerifying(false);
      navigate('/verify-otp');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4 py-8">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Verify Your Identity</h1>
          <p className="text-muted-foreground mt-2">
            Multiple accounts found for {phone || 'this phone number'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface dark:bg-gray-900 rounded-2xl shadow-xl border border-border p-8">
          <div className="space-y-6">
            {/* Info Message */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                  Please enter your name to verify your account
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  We found {pendingPatients.length} accounts with this phone number and date of birth
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 text-base border-2 focus:border-primary"
                  autoFocus
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 text-base border-2 focus:border-primary"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-error text-sm bg-error/10 p-3 rounded-lg border border-error/20">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1"
                >
                  {isVerifying ? 'Verifying...' : 'Continue'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            Powered by <span className="font-medium">TensorLinks</span> - AI for Healthcare
          </p>
        </div>
      </div>
    </div>
  );
}
