import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fetchPatientProfile } from '@/services/apiClient';

// Types
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  subscriberName: string;
  relationship: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: Address;
  insurance: Insurance | null;
  emergencyContact: EmergencyContact | null;
  preferredLanguage: string;
  communicationPreferences: {
    sms: boolean;
    email: boolean;
    phone: boolean;
  };
}

interface AccountBalance {
  current: number;
  pending: number;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
}

interface PatientState {
  profile: PatientProfile | null;
  accountBalance: AccountBalance | null;
  isLoading: boolean;
  error: string | null;
}

interface PatientActions {
  setProfile: (profile: PatientProfile) => void;
  updateProfile: (updates: Partial<PatientProfile>) => void;
  setAccountBalance: (balance: AccountBalance) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPatientData: () => void;
  fetchPatientData: (patientId: string) => Promise<void>;
}

type PatientStore = PatientState & PatientActions;

const initialState: PatientState = {
  profile: null,
  accountBalance: null,
  isLoading: false,
  error: null,
};

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProfile: (profile: PatientProfile) => {
        set({ profile, error: null });
      },

      updateProfile: (updates: Partial<PatientProfile>) => {
        const { profile } = get();
        if (profile) {
          set({
            profile: { ...profile, ...updates },
            error: null,
          });
        }
      },

      setAccountBalance: (balance: AccountBalance) => {
        set({ accountBalance: balance });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearPatientData: () => {
        set(initialState);
      },

      fetchPatientData: async (patientId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Fetch patient profile from real API
          const apiResponse = await fetchPatientProfile(patientId);

          if (!apiResponse) {
            set({
              error: 'Failed to load patient data',
              isLoading: false,
            });
            return;
          }

          // Map API response to PatientProfile
          const profile: PatientProfile = {
            id: apiResponse.id,
            firstName: apiResponse.firstName,
            lastName: apiResponse.lastName,
            dateOfBirth: apiResponse.dateOfBirth,
            phone: apiResponse.phoneNumber,
            email: apiResponse.email || '',
            address: {
              street: apiResponse.address || '',
              city: apiResponse.city || '',
              state: apiResponse.state || '',
              zipCode: apiResponse.zipCode || '',
            },
            insurance: null, // Will be fetched separately if needed
            emergencyContact: null, // Will be fetched separately if needed
            preferredLanguage: apiResponse.language || 'English',
            communicationPreferences: {
              sms: apiResponse.textMessageConsent === 'Yes',
              email: true,
              phone: false,
            },
          };

          // TODO: Fetch account balance from API when endpoint is available
          const accountBalance: AccountBalance = {
            current: 0,
            pending: 0,
            lastPaymentDate: null,
            lastPaymentAmount: null,
          };

          set({
            profile,
            accountBalance,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('[PatientStore] Error fetching patient data:', error);
          set({
            error: 'Failed to load patient data',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'patient-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        accountBalance: state.accountBalance,
      }),
    }
  )
);

// Selector hooks
export const usePatientProfile = () => usePatientStore((state) => state.profile);
export const useAccountBalance = () => usePatientStore((state) => state.accountBalance);
export const usePatientLoading = () => usePatientStore((state) => state.isLoading);
export const usePatientError = () => usePatientStore((state) => state.error);
