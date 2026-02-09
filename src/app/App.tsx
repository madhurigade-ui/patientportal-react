import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/app/components/LoginPage';
import { SignUpPage } from '@/app/components/SignUpPage';
import { OTPVerificationPage } from '@/app/components/OTPVerificationPage';
import { NameVerificationPage } from '@/app/components/NameVerificationPage';
import { IdentityVerificationPage } from '@/app/components/IdentityVerificationPage';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { SummaryPage } from '@/app/components/SummaryPage';
import { AccountHistoryPage } from '@/app/components/AccountHistoryPage';
import { TreatmentPlansPage } from '@/app/components/TreatmentPlansPage';
import { InsuranceInformationPage } from '@/app/components/InsuranceInformationPage';
import { ScheduleAppointmentPage } from '@/app/components/ScheduleAppointmentPage';
import { ProfileManagePage } from '@/app/components/ProfileManagePage';
import { MyDocumentsPage } from '@/app/components/MyDocumentsPage';
import { DarkModeProvider } from '@/app/components/DarkModeContext';
import { AppointmentsProvider } from '@/app/components/AppointmentsContext';

export default function App() {
  return (
    <DarkModeProvider>
      <AppointmentsProvider>
        <MemoryRouter initialEntries={['/login']} initialIndex={0}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/verify-name" element={<NameVerificationPage />} />
            <Route path="/verify-identity" element={<IdentityVerificationPage />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointmentPage />} />
            <Route path="/profile-manage" element={<ProfileManagePage />} />
            <Route path="/my-documents" element={<MyDocumentsPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/summary" replace />} />
              <Route path="summary" element={<SummaryPage />} />
              <Route path="account-history" element={<AccountHistoryPage />} />
              <Route path="treatment-plans" element={<TreatmentPlansPage />} />
              <Route path="insurance" element={<InsuranceInformationPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </MemoryRouter>
      </AppointmentsProvider>
    </DarkModeProvider>
  );
}