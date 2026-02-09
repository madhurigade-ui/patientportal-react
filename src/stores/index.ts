// Auth Store
export {
  useAuthStore,
  useIsAuthenticated,
  useUser,
  useAuthLoading,
  usePhone,
} from './authStore';

// Patient Store
export {
  usePatientStore,
  usePatientProfile,
  useAccountBalance,
  usePatientLoading,
  usePatientError,
} from './patientStore';

// Clinic Store
export {
  useClinicStore,
  useClinic,
  useClinicLoading,
  useClinicError,
} from './clinicStore';

// Appointment Store
export {
  useAppointmentStore,
  useAppointments,
  useUpcomingAppointments,
  usePastAppointments,
  useSelectedAppointment,
  useAppointmentLoading,
  useAppointmentError,
} from './appointmentStore';

// Document Store
export {
  useDocumentStore,
  useDocuments,
  useClinicalDocuments,
  useCompletedForms,
  useBillingDocuments,
  useSelectedDocument,
  useDocumentLoading,
  useDocumentError,
  useDocumentSearchQuery,
  useFilteredDocuments,
} from './documentStore';
