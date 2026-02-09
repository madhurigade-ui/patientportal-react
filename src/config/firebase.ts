// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from 'firebase/auth';
import { environment } from './environment';

// Initialize Firebase
const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Store confirmation result for OTP verification
let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaRendered = false;

// Initialize invisible reCAPTCHA
export async function initRecaptcha(containerId: string): Promise<RecaptchaVerifier | null> {
  try {
    // Check if container already has children (already initialized)
    const container = document.getElementById(containerId);
    if (container?.hasChildNodes()) {
      return recaptchaVerifier;
    }

    // Clear existing verifier if any
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {
        // Ignore clear errors
      }
      recaptchaVerifier = null;
      recaptchaRendered = false;
    }

    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[Firebase] reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('[Firebase] reCAPTCHA expired');
        recaptchaRendered = false;
      },
      'error-callback': (error: Error) => {
        console.error('[Firebase] reCAPTCHA error:', error);
      },
    });

    // Render the reCAPTCHA (important - Angular does this too)
    await recaptchaVerifier.render();
    recaptchaRendered = true;
    console.log('[Firebase] reCAPTCHA rendered successfully');

    return recaptchaVerifier;
  } catch (error) {
    console.error('[Firebase] Error initializing reCAPTCHA:', error);
    return null;
  }
}

// Send OTP to phone number
export async function sendOTPFirebase(
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Initialize and render recaptcha if not already done
    if (!recaptchaVerifier || !recaptchaRendered) {
      await initRecaptcha(recaptchaContainerId);
    }

    if (!recaptchaVerifier) {
      return { success: false, error: 'Failed to initialize reCAPTCHA. Please refresh and try again.' };
    }

    // Send OTP
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );

    console.log('[Firebase] OTP sent successfully');
    return { success: true };
  } catch (error: unknown) {
    console.error('[Firebase] Error sending OTP:', error);

    // Handle specific Firebase errors
    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Failed to send verification code';

    switch (firebaseError.code) {
      case 'auth/invalid-phone-number':
        errorMessage = 'Invalid phone number format';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later';
        break;
      case 'auth/captcha-check-failed':
        errorMessage = 'reCAPTCHA verification failed. Please refresh and try again';
        // Reset reCAPTCHA on failure
        clearRecaptcha();
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'This domain is not authorized for Firebase. Please contact support.';
        break;
      case 'auth/invalid-app-credential':
        errorMessage = 'Firebase configuration error. Please contact support.';
        break;
      case 'auth/internal-error':
        errorMessage = 'Authentication service error. Please try again.';
        // Reset reCAPTCHA on internal error
        clearRecaptcha();
        break;
      default:
        errorMessage = firebaseError.message || 'Failed to send verification code';
    }

    return { success: false, error: errorMessage };
  }
}

// Verify OTP and get ID token
export async function verifyOTPFirebase(
  otp: string
): Promise<{ success: boolean; idToken?: string; error?: string }> {
  if (!confirmationResult) {
    return { success: false, error: 'No OTP request found. Please request a new code.' };
  }

  try {
    // Confirm the OTP
    const userCredential = await confirmationResult.confirm(otp);

    // Get the ID token
    const idToken = await userCredential.user.getIdToken();

    console.log('[Firebase] OTP verified successfully');
    return { success: true, idToken };
  } catch (error: unknown) {
    console.error('[Firebase] Error verifying OTP:', error);

    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Invalid verification code';

    switch (firebaseError.code) {
      case 'auth/invalid-verification-code':
        errorMessage = 'Invalid verification code. Please try again';
        break;
      case 'auth/code-expired':
        errorMessage = 'Verification code expired. Please request a new code';
        break;
      case 'auth/missing-verification-code':
        errorMessage = 'Please enter the verification code';
        break;
      default:
        errorMessage = firebaseError.message || 'Verification failed';
    }

    return { success: false, error: errorMessage };
  }
}

// Clear recaptcha (call on unmount)
export function clearRecaptcha(): void {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      // Ignore clear errors
    }
    recaptchaVerifier = null;
  }
  recaptchaRendered = false;
  confirmationResult = null;
}

// Check if Firebase is initialized
export function isFirebaseInitialized(): boolean {
  return !!auth;
}

export { auth };
