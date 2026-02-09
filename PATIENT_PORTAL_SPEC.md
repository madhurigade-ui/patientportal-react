# Patient Portal - Frontend Specification

## Overview
A React-based patient portal frontend application that allows patients to manage their healthcare interactions including appointments, medical records, messaging with providers, prescriptions, and billing.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI Framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| React Context | State management |
| Lucide React | Icons |

---

## Project Structure

```
patient-portal/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top navigation bar
│   │   │   ├── Sidebar.tsx         # Side navigation menu
│   │   │   ├── Footer.tsx          # Footer component
│   │   │   └── Layout.tsx          # Main layout wrapper
│   │   │
│   │   ├── common/
│   │   │   ├── Card.tsx            # Reusable card component
│   │   │   ├── Button.tsx          # Reusable button component
│   │   │   ├── Modal.tsx           # Modal dialog
│   │   │   ├── Table.tsx           # Data table component
│   │   │   └── LoadingSpinner.tsx  # Loading indicator
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx           # Main dashboard page
│   │   │   ├── UpcomingAppointments.tsx # Appointments card
│   │   │   ├── RecentResults.tsx        # Recent lab results card
│   │   │   ├── QuickActions.tsx         # Quick action buttons
│   │   │   └── HealthSummary.tsx        # Health overview card
│   │   │
│   │   ├── appointments/
│   │   │   ├── Appointments.tsx     # Appointments list page
│   │   │   ├── AppointmentCard.tsx  # Single appointment display
│   │   │   ├── BookingForm.tsx      # New appointment booking
│   │   │   ├── CalendarView.tsx     # Calendar display
│   │   │   └── AppointmentDetails.tsx # Appointment detail view
│   │   │
│   │   ├── records/
│   │   │   ├── MedicalRecords.tsx   # Records list page
│   │   │   ├── LabResults.tsx       # Lab results section
│   │   │   ├── ImagingReports.tsx   # Imaging/X-ray reports
│   │   │   ├── VisitSummaries.tsx   # Doctor visit notes
│   │   │   └── DocumentViewer.tsx   # PDF/document viewer
│   │   │
│   │   ├── messaging/
│   │   │   ├── Messaging.tsx        # Messaging main page
│   │   │   ├── InboxList.tsx        # List of conversations
│   │   │   ├── Conversation.tsx     # Chat thread view
│   │   │   ├── ComposeMessage.tsx   # New message form
│   │   │   └── ProviderSelector.tsx # Select provider to message
│   │   │
│   │   ├── prescriptions/
│   │   │   ├── Prescriptions.tsx    # Prescriptions list page
│   │   │   ├── PrescriptionCard.tsx # Single prescription display
│   │   │   ├── RefillRequest.tsx    # Request refill form
│   │   │   └── PharmacySelector.tsx # Choose pharmacy
│   │   │
│   │   └── billing/
│   │       ├── Billing.tsx          # Billing overview page
│   │       ├── BillsList.tsx        # List of bills
│   │       ├── BillDetails.tsx      # Single bill breakdown
│   │       ├── PaymentForm.tsx      # Make a payment
│   │       └── PaymentHistory.tsx   # Past payments
│   │
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication state
│   │   ├── PatientContext.tsx   # Patient data context
│   │   └── NotificationContext.tsx # App notifications
│   │
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth hook
│   │   └── usePatientData.ts    # Patient data hook
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   ├── data/
│   │   └── mockData.ts          # Mock data for demo
│   │
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles (Tailwind)
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Home page with overview cards |
| `/appointments` | Appointments | View & manage appointments |
| `/appointments/book` | BookingForm | Book new appointment |
| `/appointments/:id` | AppointmentDetails | View appointment details |
| `/records` | MedicalRecords | View all medical records |
| `/records/labs` | LabResults | Lab test results |
| `/records/imaging` | ImagingReports | X-rays, MRIs, etc. |
| `/records/visits` | VisitSummaries | Doctor visit notes |
| `/messages` | Messaging | Secure messaging |
| `/messages/compose` | ComposeMessage | Send new message |
| `/messages/:id` | Conversation | View conversation |
| `/prescriptions` | Prescriptions | View prescriptions |
| `/prescriptions/refill/:id` | RefillRequest | Request refill |
| `/billing` | Billing | View bills |
| `/billing/:id` | BillDetails | View bill details |
| `/billing/pay` | PaymentForm | Make payment |

---

## Component Details

### 1. Layout Components

**Header**
- Logo/brand name
- Search bar (optional)
- Notification bell with badge
- User profile dropdown (name, avatar, logout)

**Sidebar**
- Navigation links with icons:
  - Dashboard (Home icon)
  - Appointments (Calendar icon)
  - Medical Records (FileText icon)
  - Messages (MessageSquare icon)
  - Prescriptions (Pill icon)
  - Billing (CreditCard icon)
- Active state highlighting
- Collapsible on mobile

**Footer**
- Copyright text
- Help/Support links
- Privacy policy link

---

### 2. Dashboard Module

**UpcomingAppointments Card**
- Shows next 2-3 upcoming appointments
- Date, time, provider name, type
- Quick "View All" link

**RecentResults Card**
- Latest lab results (2-3 items)
- Status indicator (normal/abnormal)
- Link to full results

**QuickActions Card**
- Book Appointment button
- Request Refill button
- Send Message button
- Pay Bill button

**HealthSummary Card**
- Allergies list
- Current medications count
- Last visit date
- Primary care provider

---

### 3. Appointments Module

**AppointmentsList**
- Filter by: Upcoming, Past, All
- Sort by date
- Shows: Date, Time, Provider, Type, Status

**CalendarView**
- Monthly calendar grid
- Appointments marked on dates
- Click date to see details

**BookingForm**
- Select appointment type
- Choose provider
- Pick date from calendar
- Select time slot
- Reason for visit (textarea)
- Submit/Cancel buttons

**AppointmentDetails**
- Full appointment info
- Provider details
- Location/address or video link
- Cancel/Reschedule options

---

### 4. Medical Records Module

**RecordsList**
- Tabs: All, Labs, Imaging, Visits
- Filter by date range
- Search records

**LabResults**
- Test name, date, status
- Expandable to show values
- Download PDF option

**ImagingReports**
- Report type, date, ordering provider
- View report button
- Download option

**VisitSummaries**
- Visit date, provider, reason
- Diagnosis, notes
- Follow-up instructions

**DocumentViewer**
- PDF display
- Download button
- Print option

---

### 5. Messaging Module

**InboxList**
- List of conversations
- Provider name, last message preview
- Timestamp, unread indicator

**Conversation**
- Message thread display
- Provider info header
- Reply textarea
- Send button

**ComposeMessage**
- Provider selector dropdown
- Subject line
- Message body textarea
- Attach file option
- Send/Cancel buttons

---

### 6. Prescriptions Module

**PrescriptionsList**
- Active vs. Past prescriptions
- Medication name, dosage, frequency
- Prescribing provider
- Refills remaining
- Last filled date

**PrescriptionCard**
- Medication details
- Instructions
- Refill button (if eligible)

**RefillRequest**
- Medication selection
- Pharmacy selector
- Notes to pharmacy
- Submit request

**PharmacySelector**
- List of saved pharmacies
- Add new pharmacy option
- Set as default

---

### 7. Billing Module

**BillsList**
- Outstanding bills
- Past/Paid bills tab
- Amount, date, status
- Pay Now button

**BillDetails**
- Service breakdown
- Provider info
- Insurance adjustments
- Patient responsibility
- Payment options

**PaymentForm**
- Amount to pay
- Payment method (card)
- Card details form
- Submit payment

**PaymentHistory**
- Past payments list
- Date, amount, method
- Receipt download

---

## Mock Data Structure

```typescript
// Types to be created in src/types/index.ts

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  allergies: string[];
  primaryProvider: Provider;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: Provider;
  type: 'In-Person' | 'Video' | 'Phone';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  reason: string;
  location?: string;
}

interface LabResult {
  id: string;
  testName: string;
  date: string;
  status: 'Normal' | 'Abnormal' | 'Pending';
  results: LabValue[];
}

interface Message {
  id: string;
  providerId: string;
  providerName: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  messages: MessageThread[];
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescriber: Provider;
  refillsRemaining: number;
  lastFilled: string;
  pharmacy: string;
  status: 'Active' | 'Expired';
}

interface Bill {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  dueDate: string;
}
```

---

## UI Design Guidelines

### Colors (Tailwind)
- **Primary**: Blue-600 (`#2563EB`) - buttons, links, active states
- **Secondary**: Gray-600 (`#4B5563`) - secondary text
- **Success**: Green-500 (`#22C55E`) - success states, normal results
- **Warning**: Yellow-500 (`#EAB308`) - warnings, pending
- **Error**: Red-500 (`#EF4444`) - errors, abnormal results
- **Background**: Gray-50 (`#F9FAFB`) - page background
- **Card Background**: White - card surfaces
- **Text**: Gray-900 - primary text

### Typography
- Headings: font-semibold, text-gray-900
- Body: font-normal, text-gray-700
- Small/Helper: text-sm, text-gray-500

### Spacing
- Page padding: p-6
- Card padding: p-4
- Section gaps: space-y-6
- Grid gaps: gap-4 or gap-6

### Components
- Cards: rounded-lg, shadow-sm, border border-gray-200
- Buttons: rounded-md, px-4 py-2, font-medium
- Inputs: rounded-md, border-gray-300, focus:ring-blue-500

---

## Implementation Order

1. **Setup** - Vite config, Tailwind, folder structure
2. **Layout** - Header, Sidebar, Footer, Layout wrapper
3. **Routing** - React Router setup with all routes
4. **Context** - Auth and Patient data contexts
5. **Mock Data** - Sample data for all modules
6. **Dashboard** - All dashboard cards
7. **Appointments** - List, details, booking
8. **Records** - List, labs, imaging, visits
9. **Messaging** - Inbox, conversation, compose
10. **Prescriptions** - List, refill request
11. **Billing** - Bills, payment form

---

## Notes

- This is a **frontend-only** implementation with mock data
- No backend API integration (can be added later)
- Authentication is simulated (no real login)
- All data is static/mock for demonstration
- Responsive design for desktop and mobile

---

## Files to Create/Modify

### New Files (to create):
- All components listed in project structure above
- `src/types/index.ts` - TypeScript interfaces
- `src/data/mockData.ts` - Mock data
- `src/context/*.tsx` - Context providers
- `src/hooks/*.ts` - Custom hooks

### Files to Modify:
- `vite.config.ts` - Add Tailwind plugin
- `src/index.css` - Replace with Tailwind imports
- `src/App.tsx` - Add routing and layout
- `src/main.tsx` - Add context providers

### Files to Delete:
- `src/App.css` - Not needed with Tailwind
- Default Vite assets we won't use
