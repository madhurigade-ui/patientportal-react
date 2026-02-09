import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, UserCheck, Smile } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';

export function IdentityVerificationPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      navigate('/dashboard/summary');
    }, 1000);
  };

  const handleBack = () => {
    navigate('/verify-otp');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl"
              >
                <Smile className="w-8 h-8" />
              </motion.div>
              <h1 className="text-2xl font-bold">Bright Smile Dental</h1>
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Verify Your Identity</h2>
            <p className="text-purple-100 text-center text-sm">
              Multiple accounts found with this phone number and date of birth. 
              Please enter your name to continue.
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Info Message */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-900">
                  For your security, please confirm your identity by entering your name as it appears in our records.
                </p>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 pl-4 pr-4 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 pl-4 pr-4 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!firstName || !lastName || isVerifying}
                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 mt-6 text-sm"
        >
          Powered by TensorLinks - AI for Healthcare
        </motion.p>
      </motion.div>
    </div>
  );
}
