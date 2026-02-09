// Environment configuration - matches Angular app settings
export const environment = {
  production: false,
  debug: true,

  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4300',
  apiKey: import.meta.env.VITE_API_KEY || 'AIzaSyAtBxir34odZFDYlGve33oDRz367zupPTM',

  // Tenant Configuration
  tenantId: import.meta.env.VITE_TENANT_ID || 'brightsmiledental',
  clientId: import.meta.env.VITE_CLIENT_ID || 'tlnk-brightsmiledental-tx',
  orgId: import.meta.env.VITE_ORG_ID || 'tlnk-def-1f3ce',

  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDRNb3ei0euI5uHVKA2wU1cum96Ytytwd8',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'project-001-dev.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'project-001-dev',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'project-001-dev.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1011039981452',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1011039981452:web:b7d9828b34d9d77c2c90a9',
  },

  // reCAPTCHA
  recaptcha: {
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  },
};

// Build tenant-specific API URL
export function getApiUrl(): string {
  let apiUrl = environment.apiUrl;

  // In production, use tenant subdomain
  if (environment.tenantId && apiUrl.startsWith('https://')) {
    apiUrl = apiUrl.replace('https://', `https://${environment.tenantId}.`);
  }

  return apiUrl;
}
