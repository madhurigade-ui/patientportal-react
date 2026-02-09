import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
interface ClinicHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface ClinicInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  hours: ClinicHours[];
  timezone: string;
  logo?: string;
}

interface ClinicState {
  clinic: ClinicInfo | null;
  isLoading: boolean;
  error: string | null;
}

interface ClinicActions {
  setClinic: (clinic: ClinicInfo) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchClinicInfo: (clinicId: string) => Promise<void>;
  clearClinicData: () => void;
}

type ClinicStore = ClinicState & ClinicActions;

const initialState: ClinicState = {
  clinic: null,
  isLoading: false,
  error: null,
};

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set) => ({
      ...initialState,

      setClinic: (clinic: ClinicInfo) => {
        set({ clinic, error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearClinicData: () => {
        set(initialState);
      },

      fetchClinicInfo: async (clinicId: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Mock clinic data
          const mockClinic: ClinicInfo = {
            id: clinicId,
            name: 'Bright Smile Dental',
            phone: '+1 (555) 123-4567',
            email: 'info@brightsmile.com',
            address: {
              street: '456 Healthcare Blvd',
              city: 'Austin',
              state: 'TX',
              zipCode: '78702',
            },
            hours: [
              { day: 'Monday', open: '8:00 AM', close: '5:00 PM', isClosed: false },
              { day: 'Tuesday', open: '8:00 AM', close: '5:00 PM', isClosed: false },
              { day: 'Wednesday', open: '8:00 AM', close: '5:00 PM', isClosed: false },
              { day: 'Thursday', open: '8:00 AM', close: '5:00 PM', isClosed: false },
              { day: 'Friday', open: '8:00 AM', close: '3:00 PM', isClosed: false },
              { day: 'Saturday', open: '9:00 AM', close: '1:00 PM', isClosed: false },
              { day: 'Sunday', open: '', close: '', isClosed: true },
            ],
            timezone: 'America/Chicago',
          };

          set({
            clinic: mockClinic,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'Failed to load clinic information',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'clinic-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        clinic: state.clinic,
      }),
    }
  )
);

// Selector hooks
export const useClinic = () => useClinicStore((state) => state.clinic);
export const useClinicLoading = () => useClinicStore((state) => state.isLoading);
export const useClinicError = () => useClinicStore((state) => state.error);
