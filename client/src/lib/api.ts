// API client for GLIBRA monetization features

export interface Plan {
  planCode: string;
  name: string;
  description: string;
  price: {
    cents: number;
    display: string;
  };
  interval: string;
  role: 'TRAVELER' | 'HOST';
  tier: string;
  entitlements: any;
  isPopular: boolean;
}

export interface PlansResponse {
  travelerPlans: Plan[];
  hostPlans: Plan[];
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'TRAVELER' | 'HOST' | 'ADMIN';
  };
}

export interface UserData {
  user: {
    id: string;
    email: string;
    name?: string;
    role: 'TRAVELER' | 'HOST' | 'ADMIN';
  };
  subscription?: {
    planCode: string;
    status: string;
    currentPeriodEnd: string;
  };
  creditsBalance: number;
}

const API_BASE = '/api';

// Auth token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('glibra_auth_token', token);
  } else {
    localStorage.removeItem('glibra_auth_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('glibra_auth_token');
  }
  return authToken;
}

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include session cookies for Replit Auth
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// API functions

export async function fetchPlans(): Promise<PlansResponse> {
  return apiRequest<PlansResponse>('/plans');
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  email: string;
  name: string;
  role: 'TRAVELER' | 'HOST';
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(): Promise<UserData> {
  return apiRequest<UserData>('/auth/me');
}

export async function createCheckoutSession(planCode: string): Promise<{ url: string }> {
  return apiRequest<{ url: string }>('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({
      planCode,
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/pricing?canceled=true`,
    }),
  });
}

export async function createPortalSession(): Promise<{ url: string }> {
  return apiRequest<{ url: string }>('/billing/portal', {
    method: 'POST',
  });
}

// Initialize auth token on load
if (typeof window !== 'undefined') {
  setAuthToken(getAuthToken());
}