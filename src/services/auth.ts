import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  UserRole,
} from '../types/auth';

const AUTH_ENDPOINT = '/api/auth';


export async function loginUser(
  credentials: LoginCredentials,
  role: UserRole,
): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...credentials, role }),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please try again.');
  }

  return data;
}


export async function registerUser(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const response = await fetch(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json()) as RegisterResponse;

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed. Please try again.');
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch(`${AUTH_ENDPOINT}/me`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to restore session.');
  }

  return data.user;
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(`${AUTH_ENDPOINT}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Logout failed.');
  }
}