import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import { Calendar } from '@/app/components/ui/calendar';
import { useAppointments } from '@/app/components/AppointmentsContext';

const dentalReasons = [
  'Chipped tooth',
  'Toothache',
  'Knocked-out tooth',
  'Lost filling or crown',
  'Abscess',
  'Cavity filling',
  'Root canal',
  'Teeth whitening',
  'Gum treatment',
  'Wisdom teeth removal',
];

const timeSlots = {
  'Room 1': [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM',
    '1:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  ],
  'Room 3': [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM',
    '3:30 PM', '4:00 PM', '4:30 PM',
  ],
};

export function ScheduleAppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAppointment, rescheduleAppointment, appointments } = useAppointments();
  const rescheduleId = location.state?.rescheduleId;
  const existingAppointment = rescheduleId ? appointments.find(apt => apt.id === rescheduleId) : null;
  
  const [step, setStep] = useState<'reason' | 'datetime' | 'confirm' | 'success'>(
    rescheduleId ? 'datetime' : 'reason'
  );
  const [reason, setReason] = useState(existingAppointment?.type || '');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    existingAppointment ? new Date(existingAppointment.date) : new Date(2026, 1, 3)
  );
  const [selectedTime, setSelectedTime] = useState(existingAppointment?.time || '');
  const [selectedRoom, setSelectedRoom] = useState(existingAppointment?.room || '');

  const handleReasonSubmit = () => {
    if (reason.trim()) {
      setStep('datetime');
    }
  };

  const handleTimeSelect = (time: string, room: string) => {
    setSelectedTime(time);
    setSelectedRoom(room);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime && reason) {
      if (rescheduleId) {
        // Reschedule existing appointment
        rescheduleAppointment(rescheduleId, selectedDate, selectedTime, selectedRoom);
      } else {
        // Add new appointment
        addAppointment({
          date: selectedDate,
          time: selectedTime,
          duration: '30 minutes',
          type: reason,
          status: 'scheduled',
          insurance: 'Unknown',
          room: selectedRoom,
        });
      }
    }
    
    setStep('success');
    setTimeout(() => {
      navigate('/dashboard/summary');
    }, 2000);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => step === 'reason' ? navigate('/dashboard/summary') : setStep('reason')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Schedule Appointment</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Reason */}
          {step === 'reason' && (
            <motion.div
              key="reason"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Describe your dental need
                    </label>
                    <div className="relative">
                      <Textarea
                        placeholder="E.g., Teeth cleaning, cavity filling, etc."
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value);
                          setShowSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                      />
                      <button
                        onClick={handleReasonSubmit}
                        disabled={!reason.trim()}
                        className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      {dentalReasons.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setReason(suggestion);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 text-gray-700"
                        >
                          <Send className="w-4 h-4 text-purple-600" />
                          {suggestion}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 'datetime' && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Reason Display */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Describe your dental need
                    </label>
                    <div className="relative">
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[100px] resize-none border-2 border-gray-200 rounded-xl"
                      />
                      <button
                        className="absolute bottom-3 right-3 bg-purple-600 text-white p-2 rounded-full"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-xl border-2 border-gray-200"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Select a time slot for <span className="text-purple-600 dark:text-purple-400">{formatDate(selectedDate)}:</span>
                      </h3>

                      {Object.entries(timeSlots).map(([room, slots]) => (
                        <div key={room} className="space-y-3">
                          <h4 className="text-base font-semibold text-purple-600 dark:text-purple-400">{room}</h4>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {slots.map((time) => (
                              <button
                                key={time}
                                onClick={() => handleTimeSelect(time, room)}
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-sm font-medium"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Continue</h2>

                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-8 dark:bg-purple-950/20 dark:border-purple-800">
                  <div className="flex items-start gap-3 mb-4">
                    <CalendarIcon className="w-6 h-6 text-purple-600 mt-1 dark:text-purple-400" />
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedDate?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })} at {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-medium">For:</span> {reason}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span> 30 mins
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleConfirm}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-lg font-semibold"
                >
                  Continue
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <Card className="p-8 max-w-md w-full">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-white">
                    {rescheduleId ? 'Appointment Rescheduled Successfully!' : 'Appointment Scheduled Successfully!'}
                  </h2>
                  <p className="text-gray-600 mb-2 dark:text-gray-400">
                    {rescheduleId ? 'Your appointment has been successfully rescheduled to:' : 'Your appointment has been confirmed for:'}
                  </p>
                  <p className="text-lg font-semibold text-purple-600 mb-1 dark:text-purple-400">
                    {formatDate(selectedDate)} at {selectedTime}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRoom}
                  </p>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl dark:bg-blue-950/20">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      A confirmation has been sent to your phone. You'll receive a reminder 24 hours before your appointment.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}