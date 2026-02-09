import type { Patient, Provider, Appointment, LabResult, ImagingReport, VisitSummary, Message, Prescription, Pharmacy, Bill, Payment } from '../types';

export const providers: Provider[] = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Primary Care', avatar: '' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiology', avatar: '' },
  { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatology', avatar: '' },
  { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', avatar: '' },
];

export const currentPatient: Patient = {
  id: 'p1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@email.com',
  phone: '(555) 123-4567',
  dateOfBirth: '1985-06-15',
  allergies: ['Penicillin', 'Sulfa drugs'],
  primaryProvider: providers[0],
};

export const appointments: Appointment[] = [
  {
    id: 'a1',
    date: '2026-02-10',
    time: '09:00 AM',
    provider: providers[0],
    type: 'In-Person',
    status: 'Scheduled',
    reason: 'Annual Physical Exam',
    location: '123 Medical Center Dr, Suite 100',
  },
  {
    id: 'a2',
    date: '2026-02-15',
    time: '02:30 PM',
    provider: providers[1],
    type: 'Video',
    status: 'Scheduled',
    reason: 'Follow-up: Blood Pressure',
  },
  {
    id: 'a3',
    date: '2026-01-20',
    time: '10:00 AM',
    provider: providers[0],
    type: 'In-Person',
    status: 'Completed',
    reason: 'Flu symptoms',
    location: '123 Medical Center Dr, Suite 100',
  },
  {
    id: 'a4',
    date: '2026-01-05',
    time: '11:30 AM',
    provider: providers[2],
    type: 'In-Person',
    status: 'Completed',
    reason: 'Skin check',
    location: '456 Dermatology Clinic',
  },
];

export const labResults: LabResult[] = [
  {
    id: 'l1',
    testName: 'Complete Blood Count (CBC)',
    date: '2026-01-25',
    status: 'Normal',
    orderedBy: providers[0],
    results: [
      { name: 'White Blood Cells', value: '7.5', unit: 'K/uL', referenceRange: '4.5-11.0', status: 'Normal' },
      { name: 'Red Blood Cells', value: '4.8', unit: 'M/uL', referenceRange: '4.5-5.5', status: 'Normal' },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5-17.5', status: 'Normal' },
      { name: 'Platelets', value: '250', unit: 'K/uL', referenceRange: '150-400', status: 'Normal' },
    ],
  },
  {
    id: 'l2',
    testName: 'Lipid Panel',
    date: '2026-01-25',
    status: 'Abnormal',
    orderedBy: providers[1],
    results: [
      { name: 'Total Cholesterol', value: '245', unit: 'mg/dL', referenceRange: '<200', status: 'Abnormal' },
      { name: 'LDL Cholesterol', value: '160', unit: 'mg/dL', referenceRange: '<100', status: 'Abnormal' },
      { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', referenceRange: '>40', status: 'Normal' },
      { name: 'Triglycerides', value: '180', unit: 'mg/dL', referenceRange: '<150', status: 'Abnormal' },
    ],
  },
  {
    id: 'l3',
    testName: 'Basic Metabolic Panel',
    date: '2026-01-20',
    status: 'Normal',
    orderedBy: providers[0],
    results: [
      { name: 'Glucose', value: '95', unit: 'mg/dL', referenceRange: '70-100', status: 'Normal' },
      { name: 'Sodium', value: '140', unit: 'mEq/L', referenceRange: '136-145', status: 'Normal' },
      { name: 'Potassium', value: '4.2', unit: 'mEq/L', referenceRange: '3.5-5.0', status: 'Normal' },
      { name: 'Creatinine', value: '1.0', unit: 'mg/dL', referenceRange: '0.7-1.3', status: 'Normal' },
    ],
  },
];

export const imagingReports: ImagingReport[] = [
  {
    id: 'i1',
    type: 'Chest X-Ray',
    date: '2026-01-15',
    orderedBy: providers[0],
    findings: 'No acute cardiopulmonary abnormality. Heart size normal. Lungs are clear.',
    status: 'Available',
  },
  {
    id: 'i2',
    type: 'Knee MRI (Right)',
    date: '2025-12-10',
    orderedBy: providers[3],
    findings: 'Mild degenerative changes. No meniscal tear. ACL and PCL intact.',
    status: 'Available',
  },
];

export const visitSummaries: VisitSummary[] = [
  {
    id: 'v1',
    date: '2026-01-20',
    provider: providers[0],
    reason: 'Flu symptoms',
    diagnosis: 'Influenza A',
    notes: 'Patient presented with fever, body aches, and cough for 2 days. Rapid flu test positive for Influenza A. Prescribed Tamiflu. Rest and fluids recommended.',
    followUp: 'Return if symptoms worsen or do not improve in 5-7 days',
  },
  {
    id: 'v2',
    date: '2026-01-05',
    provider: providers[2],
    reason: 'Annual skin check',
    diagnosis: 'No concerning lesions',
    notes: 'Full body skin examination performed. No suspicious moles or lesions identified. Counseled on sun protection.',
    followUp: 'Annual skin check in 12 months',
  },
];

export const pharmacies: Pharmacy[] = [
  { id: 'ph1', name: 'CVS Pharmacy', address: '100 Main St, Anytown, ST 12345', phone: '(555) 234-5678', isDefault: true },
  { id: 'ph2', name: 'Walgreens', address: '200 Oak Ave, Anytown, ST 12345', phone: '(555) 345-6789', isDefault: false },
];

export const prescriptions: Prescription[] = [
  {
    id: 'rx1',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    instructions: 'Take one tablet by mouth every morning',
    prescriber: providers[1],
    refillsRemaining: 3,
    lastFilled: '2026-01-15',
    pharmacy: pharmacies[0],
    status: 'Active',
  },
  {
    id: 'rx2',
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at bedtime',
    instructions: 'Take one tablet by mouth at bedtime',
    prescriber: providers[1],
    refillsRemaining: 5,
    lastFilled: '2026-01-15',
    pharmacy: pharmacies[0],
    status: 'Active',
  },
  {
    id: 'rx3',
    medication: 'Tamiflu',
    dosage: '75mg',
    frequency: 'Twice daily for 5 days',
    instructions: 'Take one capsule by mouth twice daily with food',
    prescriber: providers[0],
    refillsRemaining: 0,
    lastFilled: '2026-01-20',
    pharmacy: pharmacies[0],
    status: 'Expired',
  },
];

export const messages: Message[] = [
  {
    id: 'm1',
    providerId: '1',
    providerName: 'Dr. Sarah Johnson',
    subject: 'Lab Results Review',
    preview: 'Your recent lab results are in. Overall looking good...',
    date: '2026-01-26',
    unread: true,
    messages: [
      { id: 'mt1', sender: 'provider', content: 'Hi John, your recent lab results are in. Overall looking good, but I noticed your cholesterol is slightly elevated. Let\'s discuss this at your next appointment.', timestamp: '2026-01-26T10:30:00' },
    ],
  },
  {
    id: 'm2',
    providerId: '1',
    providerName: 'Dr. Sarah Johnson',
    subject: 'Appointment Reminder',
    preview: 'Just a reminder about your upcoming annual physical...',
    date: '2026-01-24',
    unread: false,
    messages: [
      { id: 'mt2', sender: 'provider', content: 'Hi John, just a reminder about your upcoming annual physical on February 10th at 9:00 AM. Please fast for 12 hours before your appointment for blood work.', timestamp: '2026-01-24T14:00:00' },
      { id: 'mt3', sender: 'patient', content: 'Thank you for the reminder! I\'ll make sure to fast. See you then.', timestamp: '2026-01-24T16:30:00' },
    ],
  },
  {
    id: 'm3',
    providerId: '2',
    providerName: 'Dr. Michael Chen',
    subject: 'Blood Pressure Follow-up',
    preview: 'How has your blood pressure been since starting...',
    date: '2026-01-20',
    unread: false,
    messages: [
      { id: 'mt4', sender: 'provider', content: 'Hi John, how has your blood pressure been since starting the Lisinopril? Please let me know your home readings.', timestamp: '2026-01-20T09:00:00' },
      { id: 'mt5', sender: 'patient', content: 'Hi Dr. Chen, my readings have been around 125/82 in the mornings. Much better than before!', timestamp: '2026-01-20T18:00:00' },
      { id: 'mt6', sender: 'provider', content: 'That\'s great progress! Keep up the good work. We\'ll continue monitoring at your video visit next month.', timestamp: '2026-01-21T08:30:00' },
    ],
  },
];

export const bills: Bill[] = [
  {
    id: 'b1',
    date: '2026-01-25',
    serviceDate: '2026-01-20',
    description: 'Office Visit - Primary Care',
    provider: providers[0],
    amount: 250.00,
    insuranceAdjustment: 175.00,
    patientResponsibility: 75.00,
    status: 'Pending',
    dueDate: '2026-02-25',
  },
  {
    id: 'b2',
    date: '2026-01-20',
    serviceDate: '2026-01-15',
    description: 'Chest X-Ray',
    provider: providers[0],
    amount: 350.00,
    insuranceAdjustment: 280.00,
    patientResponsibility: 70.00,
    status: 'Pending',
    dueDate: '2026-02-20',
  },
  {
    id: 'b3',
    date: '2025-12-15',
    serviceDate: '2025-12-10',
    description: 'MRI - Knee',
    provider: providers[3],
    amount: 1200.00,
    insuranceAdjustment: 900.00,
    patientResponsibility: 300.00,
    status: 'Paid',
    dueDate: '2026-01-15',
  },
];

export const payments: Payment[] = [
  {
    id: 'pay1',
    date: '2026-01-10',
    amount: 300.00,
    method: 'Credit Card ending in 4242',
    billId: 'b3',
    confirmationNumber: 'PAY-2026-0110-001',
  },
];
