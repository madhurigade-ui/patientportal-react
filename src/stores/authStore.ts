import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
}

interface PendingPatient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  phone: string | null;
  patientId: string | null;
  pendingPatients: PendingPatient[];
  otpVerified: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setPhone: (phone: string) => void;
  setPatientId: (patientId: string) => void;
  setPendingPatients: (patients: PendingPatient[]) => void;
  setOtpVerified: (verified: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  phone: null,
  patientId: null,
  pendingPatients: [],
  otpVerified: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setPhone: (phone: string) => {
        set({ phone });
      },

      setPatientId: (patientId: string) => {
        set({ patientId });
        sessionStorage.setItem('patientId', patientId);
      },

      setPendingPatients: (patients: PendingPatient[]) => {
        set({ pendingPatients: patients });
      },

      setOtpVerified: (verified: boolean) => {
        set({ otpVerified: verified, isAuthenticated: verified });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        localStorage.removeItem('auth-storage');
        set(initialState);
      },

      checkAuth: () => {
        const { accessToken, isAuthenticated } = get();
        return !!accessToken && isAuthenticated;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        phone: state.phone,
        patientId: state.patientId,
      }),
    }
  )
);

// Selector hooks for optimized re-renders
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const usePhone = () => useAuthStore((state) => state.phone);
