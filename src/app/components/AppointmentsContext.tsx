import { createContext, useContext, useState, ReactNode } from 'react';

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  duration: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'missed';
  insurance: string;
  room?: string;
}

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: Date, time: string, room?: string) => void;
}

const defaultValue: AppointmentsContextType = {
  appointments: [],
  addAppointment: () => {},
  updateAppointmentStatus: () => {},
  cancelAppointment: () => {},
  rescheduleAppointment: () => {},
};

const AppointmentsContext = createContext<AppointmentsContextType>(defaultValue);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: new Date(2026, 1, 6),
      time: '10:00 AM',
      duration: '100 minutes',
      type: 'New Patient Comprehensive',
      status: 'scheduled',
      insurance: 'Unknown',
    },
    {
      id: '2',
      date: new Date(2026, 1, 27),
      time: '9:30 AM',
      duration: '100 minutes',
      type: 'New Patient Comprehensive',
      status: 'cancelled',
      insurance: 'Unknown',
    },
  ]);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const cancelAppointment = (id: string) => {
    updateAppointmentStatus(id, 'cancelled');
  };

  const rescheduleAppointment = (id: string, date: Date, time: string, room?: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, date, time, room, status: 'scheduled' as const }
          : apt
      )
    );
  };

  return (
    <AppointmentsContext.Provider
      value={{ appointments, addAppointment, updateAppointmentStatus, cancelAppointment, rescheduleAppointment }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}