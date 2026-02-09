export interface Provider {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  allergies: string[];
  primaryProvider: Provider;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: Provider;
  type: 'In-Person' | 'Video' | 'Phone';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  reason: string;
  location?: string;
}

export interface LabValue {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal';
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  status: 'Normal' | 'Abnormal' | 'Pending';
  orderedBy: Provider;
  results: LabValue[];
}

export interface ImagingReport {
  id: string;
  type: string;
  date: string;
  orderedBy: Provider;
  findings: string;
  status: 'Available' | 'Pending';
}

export interface VisitSummary {
  id: string;
  date: string;
  provider: Provider;
  reason: string;
  diagnosis: string;
  notes: string;
  followUp?: string;
}

export interface MessageThread {
  id: string;
  sender: 'patient' | 'provider';
  content: string;
  timestamp: string;
}

export interface Message {
  id: string;
  providerId: string;
  providerName: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  messages: MessageThread[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  prescriber: Provider;
  refillsRemaining: number;
  lastFilled: string;
  pharmacy: Pharmacy;
  status: 'Active' | 'Expired';
}

export interface Bill {
  id: string;
  date: string;
  serviceDate: string;
  description: string;
  provider: Provider;
  amount: number;
  insuranceAdjustment: number;
  patientResponsibility: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  dueDate: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  billId: string;
  confirmationNumber: string;
}
