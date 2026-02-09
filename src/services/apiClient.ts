// API Client - handles all HTTP requests to the backend
import { environment, getApiUrl } from '@/config/environment';
import { jwtDecode } from 'jwt-decode';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ANONYMOUS_TOKEN_KEY = 'anonymousToken';
const ANONYMOUS_TOKEN_EXPIRY_KEY = 'anonymousTokenExpiry';

// Token refresh timer
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
const TOKEN_REFRESH_BUFFER = 60000; // Refresh 1 minute before expiry (like Angular)

// Get stored tokens
export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  // Schedule proactive token refresh (like Angular)
  scheduleTokenRefresh(accessToken);
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

// Check if token is expiring soon (within 5 minutes)
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return Date.now() >= decoded.exp * 1000 - 5 * 60 * 1000;
  } catch {
    return true;
  }
}

// Schedule proactive token refresh
function scheduleTokenRefresh(accessToken: string): void {
  // Clear any existing timeout
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }

  try {
    const decoded = jwtDecode<{ exp: number }>(accessToken);
    const expiresIn = decoded.exp * 1000 - Date.now();
    const refreshIn = expiresIn - TOKEN_REFRESH_BUFFER;

    if (refreshIn > 0) {
      console.log(`[API] Scheduling token refresh in ${Math.round(refreshIn / 1000)}s`);
      refreshTimeout = setTimeout(async () => {
        console.log('[API] Proactively refreshing token...');
        await refreshAccessToken();
      }, refreshIn);
    }
  } catch (error) {
    console.error('[API] Error scheduling token refresh:', error);
  }
}

export function clearTokens(): void {
  // Clear refresh timer
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem('idToken');
  sessionStorage.removeItem('patientId');
}

// Anonymous token handling
function getAnonymousToken(): string | null {
  const token = sessionStorage.getItem(ANONYMOUS_TOKEN_KEY);
  const expiry = sessionStorage.getItem(ANONYMOUS_TOKEN_EXPIRY_KEY);

  if (!token || !expiry) return null;

  // Check if token is still valid (with 5 minute buffer)
  if (Date.now() >= parseInt(expiry) - 5 * 60 * 1000) {
    sessionStorage.removeItem(ANONYMOUS_TOKEN_KEY);
    sessionStorage.removeItem(ANONYMOUS_TOKEN_EXPIRY_KEY);
    return null;
  }

  return token;
}

function setAnonymousToken(token: string): void {
  sessionStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
  // Token valid for 1 hour
  sessionStorage.setItem(ANONYMOUS_TOKEN_EXPIRY_KEY, String(Date.now() + 60 * 60 * 1000));
}

// Fetch anonymous token from backend
async function fetchAnonymousToken(): Promise<string | null> {
  try {
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/auth/exchange_anon_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey,
      },
      body: JSON.stringify({
        id_token: 'anonymous',
        org_id: environment.orgId,
        client_id: environment.clientId,
        patient_id: 'anonymous',
      }),
    });

    if (!response.ok) {
      console.error('[API] Failed to get anonymous token:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.access_token) {
      setAnonymousToken(data.access_token);
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error('[API] Error getting anonymous token:', error);
    return null;
  }
}

// Get or fetch anonymous token
async function ensureAnonymousToken(): Promise<string | null> {
  let token = getAnonymousToken();
  if (!token) {
    token = await fetchAnonymousToken();
  }
  return token;
}

// Generic API request function
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  useAnonymousToken?: boolean;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, useAnonymousToken = false, headers = {} } = options;

  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization
  if (useAnonymousToken) {
    const anonymousToken = await ensureAnonymousToken();
    if (anonymousToken) {
      requestHeaders['Authorization'] = `Bearer ${anonymousToken}`;
    }
  } else {
    const accessToken = getAccessToken();
    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || errorData.detail || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

// Custom API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Patient lookup API
export interface PatientLookupRequest {
  orgId: string;
  clientId: string;
  phoneNumber: string;
  dob: string;
}

export interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  dateOfBirth: string;
  patientNumber?: string;
  isRegistered?: boolean;
}

export async function patientFamilyLookup(
  phoneNumber: string,
  dob: string
): Promise<PatientInfo[]> {
  const { clientId, orgId } = environment;

  const response = await apiRequest<PatientInfo[]>(
    `/${clientId}/patients/family_lookup`,
    {
      method: 'POST',
      useAnonymousToken: true,
      body: {
        orgId,
        clientId,
        phoneNumber,
        dob,
      },
    }
  );

  return Array.isArray(response) ? response : [];
}

// Token exchange API
export interface TokenExchangeResponse {
  status: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function exchangeToken(
  patientId: string,
  idToken: string
): Promise<TokenExchangeResponse> {
  const { clientId, orgId } = environment;
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/auth/exchange_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patient_id: patientId,
      id_token: idToken,
      client_id: clientId,
      org_id: orgId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'Token exchange failed',
      response.status,
      errorData
    );
  }

  return response.json();
}

// Refresh token API
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/auth/refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    if (data.access_token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      // Schedule next refresh
      scheduleTokenRefresh(data.access_token);
      console.log('[API] Token refreshed successfully');
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error('[API] Error refreshing token:', error);
    clearTokens();
    return null;
  }
}

// Initialize token refresh on app load (if token exists)
export function initializeTokenRefresh(): void {
  const accessToken = getAccessToken();
  if (accessToken && !isTokenExpired(accessToken)) {
    scheduleTokenRefresh(accessToken);
  }
}

// App Config API
export interface AppConfig {
  name: string;
  displayName: string;
  logo_url: string;
  address: string;
  phoneNumber: string;
  email: string;
  clinic_url: string;
  maps_url: string;
  client_id: string;
  org_id: string;
  tenantId: string;
  orgTenantId: string;
  timezone: string;
}

let cachedAppConfig: AppConfig | null = null;

export async function fetchAppConfig(): Promise<AppConfig | null> {
  // Return cached config if available
  if (cachedAppConfig) {
    return cachedAppConfig;
  }

  try {
    const apiUrl = getApiUrl();
    const { tenantId } = environment;

    const response = await fetch(`${apiUrl}/app_config/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[API] Failed to fetch app config:', response.status);
      return null;
    }

    const data = await response.json();
    cachedAppConfig = data as AppConfig;
    return cachedAppConfig;
  } catch (error) {
    console.error('[API] Error fetching app config:', error);
    return null;
  }
}

export function getAppConfig(): AppConfig | null {
  return cachedAppConfig;
}

// Fetch patient profile from API
export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  gender?: string;
  maritalStatus?: string;
  patientNumber?: string;
  ssn?: string;
  language?: string;
  preferredContactMethod?: string;
  textMessageConsent?: string;
}

export async function fetchPatientProfile(patientId: string): Promise<PatientProfile | null> {
  try {
    const { clientId } = environment;

    const response = await apiRequest<PatientProfile>(
      `/${clientId}/patients/profile/${patientId}`,
      { method: 'GET' }
    );

    return response;
  } catch (error) {
    console.error('[API] Error fetching patient profile:', error);
    return null;
  }
}
