import { create } from 'zustand';

// Types
interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  duration: number; // in minutes
}

interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
}

interface AppointmentActions {
  setAppointments: (appointments: Appointment[]) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchAppointments: (patientId: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  confirmAppointment: (appointmentId: string) => Promise<void>;
  clearAppointments: () => void;
}

type AppointmentStore = AppointmentState & AppointmentActions;

const initialState: AppointmentState = {
  appointments: [],
  upcomingAppointments: [],
  pastAppointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,
};

const categorizeAppointments = (appointments: Appointment[]) => {
  const now = new Date();
  const upcoming: Appointment[] = [];
  const past: Appointment[] = [];

  appointments.forEach((apt) => {
    const aptDate = new Date(`${apt.date} ${apt.time}`);
    if (aptDate >= now && apt.status !== 'cancelled') {
      upcoming.push(apt);
    } else {
      past.push(apt);
    }
  });

  // Sort upcoming by date (ascending)
  upcoming.sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

  // Sort past by date (descending)
  past.sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());

  return { upcoming, past };
};

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  ...initialState,

  setAppointments: (appointments: Appointment[]) => {
    const { upcoming, past } = categorizeAppointments(appointments);
    set({
      appointments,
      upcomingAppointments: upcoming,
      pastAppointments: past,
      error: null,
    });
  },

  setSelectedAppointment: (appointment: Appointment | null) => {
    set({ selectedAppointment: appointment });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  clearAppointments: () => {
    set(initialState);
  },

  fetchAppointments: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock appointments data
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          date: '2024-02-15',
          time: '10:00 AM',
          provider: 'Dr. Sarah Smith',
          type: 'Cleaning',
          status: 'scheduled',
          duration: 60,
        },
        {
          id: '2',
          date: '2024-03-01',
          time: '2:30 PM',
          provider: 'Dr. John Wilson',
          type: 'Check-up',
          status: 'confirmed',
          duration: 30,
        },
        {
          id: '3',
          date: '2024-01-10',
          time: '9:00 AM',
          provider: 'Dr. Sarah Smith',
          type: 'Filling',
          status: 'completed',
          duration: 45,
        },
        {
          id: '4',
          date: '2023-12-05',
          time: '11:00 AM',
          provider: 'Dr. Emily Brown',
          type: 'Cleaning',
          status: 'completed',
          duration: 60,
        },
      ];

      const { upcoming, past } = categorizeAppointments(mockAppointments);
      set({
        appointments: mockAppointments,
        upcomingAppointments: upcoming,
        pastAppointments: past,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: 'Failed to load appointments',
        isLoading: false,
      });
    }
  },

  cancelAppointment: async (appointmentId: string) => {
    const { appointments } = get();
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
      );

      const { upcoming, past } = categorizeAppointments(updatedAppointments);
      set({
        appointments: updatedAppointments,
        upcomingAppointments: upcoming,
        pastAppointments: past,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to cancel appointment',
        isLoading: false,
      });
    }
  },

  confirmAppointment: async (appointmentId: string) => {
    const { appointments } = get();
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'confirmed' as const } : apt
      );

      const { upcoming, past } = categorizeAppointments(updatedAppointments);
      set({
        appointments: updatedAppointments,
        upcomingAppointments: upcoming,
        pastAppointments: past,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to confirm appointment',
        isLoading: false,
      });
    }
  },
}));

// Selector hooks
export const useAppointments = () => useAppointmentStore((state) => state.appointments);
export const useUpcomingAppointments = () => useAppointmentStore((state) => state.upcomingAppointments);
export const usePastAppointments = () => useAppointmentStore((state) => state.pastAppointments);
export const useSelectedAppointment = () => useAppointmentStore((state) => state.selectedAppointment);
export const useAppointmentLoading = () => useAppointmentStore((state) => state.isLoading);
export const useAppointmentError = () => useAppointmentStore((state) => state.error);
