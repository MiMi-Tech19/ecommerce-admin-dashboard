import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  UserRole,
} from '../types/auth';
import { apiFetch, parseJsonResponse } from './api';

const AUTH_ENDPOINT = '/api/auth';

export async function loginUser(
  credentials: LoginCredentials,
  role: UserRole,
): Promise<LoginResponse> {
  const normalizedEmail = credentials.email.trim().toLowerCase();

  const response = await apiFetch(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: normalizedEmail,
      password: credentials.password,
      role,
    }),
  });

  return parseJsonResponse<LoginResponse>(
    response,
    'Login failed. Please try again.',
  );
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const normalizedName = credentials.name.trim();

  const response = await apiFetch(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: normalizedName,
      email: normalizedEmail,
      password: credentials.password,
    }),
  });

  return parseJsonResponse<RegisterResponse>(
    response,
    'Registration failed. Please try again.',
  );
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiFetch(`${AUTH_ENDPOINT}/me`, {
    method: 'GET',
  });

  const data = await parseJsonResponse<{ success: boolean; user: AuthUser; message?: string }>(
    response,
    'Unable to restore session.',
  );

  return data.user;
}

export async function logoutUser(): Promise<void> {
  const response = await apiFetch(`${AUTH_ENDPOINT}/logout`, {
    method: 'POST',
  });

  await parseJsonResponse<{ success: boolean; message?: string }>(
    response,
    'Logout failed.',
  );
}