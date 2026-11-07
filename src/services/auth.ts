import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  UserRole,
} from '../types/auth';

const AUTH_ENDPOINT = '/api/auth';

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!isJson) {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'Authentication service is currently unavailable (404). Please ensure the backend server is running.',
        );
      }
      if (response.status >= 500) {
        throw new Error(
          'Authentication server error. Please check your backend connection.',
        );
      }
      throw new Error(`Server returned status ${response.status}.`);
    }
    throw new Error('Server returned an unexpected non-JSON response.');
  }

  try {
    const data = (await response.json()) as T;
    return data;
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    if (/string did not match|unexpected token/i.test(raw)) {
      throw new Error(
        'Authentication response was not formatted as valid JSON.',
        { cause: err },
      );
    }
    throw new Error(fallbackMessage, { cause: err });
  }
}

export async function loginUser(
  credentials: LoginCredentials,
  role: UserRole,
): Promise<LoginResponse> {
  const normalizedEmail = credentials.email.trim().toLowerCase();

  const response = await fetch(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: normalizedEmail,
      password: credentials.password,
      role,
    }),
  });

  const data = await parseResponse<LoginResponse>(
    response,
    'Login failed. Please try again.',
  );

  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please try again.');
  }

  return data;
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const normalizedName = credentials.name.trim();

  const response = await fetch(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: normalizedName,
      email: normalizedEmail,
      password: credentials.password,
    }),
  });

  const data = await parseResponse<RegisterResponse>(
    response,
    'Registration failed. Please try again.',
  );

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed. Please try again.');
  }

  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${AUTH_ENDPOINT}/me`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await parseResponse<{ success: boolean; user: AuthUser; message?: string }>(
    response,
    'Unable to restore session.',
  );

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

  const data = await parseResponse<{ success: boolean; message?: string }>(
    response,
    'Logout failed.',
  );

  if (!response.ok) {
    throw new Error(data.message || 'Logout failed.');
  }
}