import { motion } from 'motion/react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

export function AccountHistoryPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.history.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View your visit history and charges</p>
        </div>
      </motion.div>

      {/* Empty State Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6"
            >
              <FileText className="w-12 h-12 text-purple-600" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-white">No Recent Visit History</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-400">
              You don't have any recent visits or charges in your account. Your visit history will appear here after your first appointment.
            </p>

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Schedule Appointment
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <h3 className="font-semibold text-blue-900 mb-1 dark:text-blue-300">Total Visits</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
            <p className="text-sm text-blue-700 mt-1 dark:text-blue-400">No visits recorded</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900">
            <h3 className="font-semibold text-purple-900 mb-1 dark:text-purple-300">Total Charges</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">$0.00</p>
            <p className="text-sm text-purple-700 mt-1 dark:text-purple-400">All time</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-1">Outstanding Balance</h3>
            <p className="text-3xl font-bold text-green-600">$0.00</p>
            <p className="text-sm text-green-700 mt-1">Fully paid</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}