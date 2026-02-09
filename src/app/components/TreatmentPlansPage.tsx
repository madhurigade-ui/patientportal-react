import { motion } from 'motion/react';
import { ClipboardList, ArrowLeft, Phone } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

export function TreatmentPlansPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Treatment Plans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your treatment plans</p>
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
              <ClipboardList className="w-12 h-12 text-purple-600" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-white">No Treatment Plan Available</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-400">
              No treatment plans found for this patient. Your dentist will create a personalized treatment plan after your comprehensive exam.
            </p>

            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Contact Our Office
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-900">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">What is a Treatment Plan?</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>A comprehensive overview of recommended dental procedures and treatments</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Detailed cost estimates and insurance coverage information</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Timeline and priority of treatments to restore your oral health</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Options and alternatives discussed with your dentist</span>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Need to discuss your treatment?</h3>
              <p className="text-purple-100">Our team is here to answer all your questions</p>
            </div>
            <Button
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              Call +1 945 237 1296
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}