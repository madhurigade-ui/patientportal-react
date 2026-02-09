// Auth Service - handles login flow, validation, and API calls
import {
  patientFamilyLookup,
  exchangeToken as apiExchangeToken,
  setTokens,
  clearTokens,
  PatientInfo,
  ApiError,
} from './apiClient';

// Phone number validation - accepts 10 or 11 digit US numbers
export function validatePhoneNumber(phone: string): { valid: boolean; formatted: string; error?: string } {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check length
  if (digitsOnly.length === 0) {
    return { valid: false, formatted: '', error: 'Phone number is required' };
  }

  if (digitsOnly.length < 10) {
    return { valid: false, formatted: phone, error: 'Phone number must be at least 10 digits' };
  }

  if (digitsOnly.length > 11) {
    return { valid: false, formatted: phone, error: 'Phone number is too long' };
  }

  // Format as +1XXXXXXXXXX
  let formatted: string;
  if (digitsOnly.length === 10) {
    formatted = `+1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    formatted = `+${digitsOnly}`;
  } else {
    return { valid: false, formatted: phone, error: 'Invalid phone number format' };
  }

  return { valid: true, formatted };
}

// DOB validation
export function validateDOB(dob: string): { valid: boolean; formatted: string; error?: string } {
  if (!dob) {
    return { valid: false, formatted: '', error: 'Date of birth is required' };
  }

  const date = new Date(dob);
  if (isNaN(date.getTime())) {
    return { valid: false, formatted: dob, error: 'Invalid date format' };
  }

  // Check if date is in the future
  if (date > new Date()) {
    return { valid: false, formatted: dob, error: 'Date of birth cannot be in the future' };
  }

  // Check if date is too old (over 120 years)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  if (date < minDate) {
    return { valid: false, formatted: dob, error: 'Please enter a valid date of birth' };
  }

  // Format as YYYY-MM-DD using local date to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formatted = `${year}-${month}-${day}`;

  return { valid: true, formatted };
}

// Re-export PatientInfo type
export type { PatientInfo };

export interface PatientLookupResult {
  success: boolean;
  patients: PatientInfo[];
  error?: string;
}

// Patient lookup - calls real backend API
export async function patientLookup(phone: string, dob: string): Promise<PatientLookupResult> {
  // Validate inputs
  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.valid) {
    return { success: false, patients: [], error: phoneValidation.error };
  }

  const dobValidation = validateDOB(dob);
  if (!dobValidation.valid) {
    return { success: false, patients: [], error: dobValidation.error };
  }

  try {
    // Call real backend API
    const patients = await patientFamilyLookup(phoneValidation.formatted, dobValidation.formatted);

    if (patients.length === 0) {
      return {
        success: false,
        patients: [],
        error: 'No patient record found with this phone number and date of birth. Would you like to create a new account?',
      };
    }

    return { success: true, patients };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        return {
          success: false,
          patients: [],
          error: 'No patient record found with this phone number and date of birth. Would you like to create a new account?',
        };
      }
      return { success: false, patients: [], error: error.message };
    }
    return { success: false, patients: [], error: 'Unable to connect to server. Please try again.' };
  }
}

// Verify patient by name (when multiple matches)
export async function verifyPatientByName(
  patients: PatientInfo[],
  firstName: string,
  lastName: string
): Promise<{ success: boolean; patient?: PatientInfo; error?: string }> {
  // Case-insensitive name matching
  const match = patients.find(
    (p) =>
      p.firstName.toLowerCase() === firstName.toLowerCase() &&
      p.lastName.toLowerCase() === lastName.toLowerCase()
  );

  if (!match) {
    return {
      success: false,
      error: 'No matching account found. Please check your name and try again.',
    };
  }

  return { success: true, patient: match };
}

// Send OTP - uses Firebase Phone Auth
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.valid) {
    return { success: false, error: phoneValidation.error };
  }

  // In a real implementation, this would trigger Firebase phone auth
  // For now, we'll simulate it since Firebase needs to be properly initialized
  console.log(`OTP would be sent to ${phoneValidation.formatted}`);
  return { success: true };
}

// Verify OTP - validates the code format
export async function verifyOTP(otp: string): Promise<{ success: boolean; idToken?: string; error?: string }> {
  // Validate OTP format
  if (!/^\d{6}$/.test(otp)) {
    return { success: false, error: 'Invalid OTP format. Please enter 6 digits.' };
  }

  // In a real implementation, this would verify with Firebase
  // For demo, accept any 6-digit OTP and return a mock token
  // The actual Firebase ID token would come from confirmationResult.confirm(otp)
  const mockIdToken = `firebase-id-token-${Date.now()}`;
  return { success: true, idToken: mockIdToken };
}

// Exchange token - calls real backend API
export async function exchangeToken(
  patientId: string,
  idToken: string
): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; error?: string }> {
  try {
    const response = await apiExchangeToken(patientId, idToken);

    if (response.access_token && response.refresh_token) {
      setTokens(response.access_token, response.refresh_token);
      return {
        success: true,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      };
    }

    return { success: false, error: 'Invalid token response' };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Token exchange failed. Please try again.' };
  }
}

// Remember Me - encrypted storage (simplified version)
const REMEMBER_ME_KEY = 'patient_portal_remember_me';
const REMEMBER_ME_EXPIRY_DAYS = 30;

export function saveRememberMe(phone: string): void {
  const data = {
    phone,
    expiry: Date.now() + REMEMBER_ME_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  };
  // In real app, this would be encrypted
  localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(data));
}

export function loadRememberMe(): string | null {
  try {
    const stored = localStorage.getItem(REMEMBER_ME_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    if (data.expiry < Date.now()) {
      localStorage.removeItem(REMEMBER_ME_KEY);
      return null;
    }

    return data.phone;
  } catch {
    return null;
  }
}

export function clearRememberMe(): void {
  localStorage.removeItem(REMEMBER_ME_KEY);
}

// Logout - clear all tokens
export function logout(): void {
  clearTokens();
  clearRememberMe();
}
