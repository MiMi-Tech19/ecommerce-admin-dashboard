import { apiFetch, parseJsonResponse } from './api';

const SESSIONS_ENDPOINT = '/api/sessions';

export interface UserSession {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastActive: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface SessionHistory {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastActive: string;
  expiresAt: string;
  revokedAt: string | null;
  loggedOutAt: string | null;
}

interface SessionsResponse {
  success: boolean;
  data: UserSession[];
  message?: string;
}

interface SessionHistoryResponse {
  success: boolean;
  data: SessionHistory[];
  message?: string;
}

interface SessionActionResponse {
  success: boolean;
  message: string;
  revokedCount?: number;
}

export async function getActiveSessions(): Promise<UserSession[]> {
  const response = await apiFetch(SESSIONS_ENDPOINT);

  const data = await parseJsonResponse<SessionsResponse>(
    response,
    'Unable to retrieve active sessions.',
  );

  return data.data;
}

export async function getSessionHistory(): Promise<SessionHistory[]> {
  const response = await apiFetch(`${SESSIONS_ENDPOINT}/history`);

  const data = await parseJsonResponse<SessionHistoryResponse>(
    response,
    'Unable to retrieve session history.',
  );

  return data.data;
}

export async function revokeSession(id: string): Promise<SessionActionResponse> {
  const response = await apiFetch(
    `${SESSIONS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
  );

  return parseJsonResponse<SessionActionResponse>(
    response,
    'Unable to terminate session.',
  );
}

export async function revokeAllSessions(): Promise<SessionActionResponse> {
  const response = await apiFetch(`${SESSIONS_ENDPOINT}/all`, {
    method: 'DELETE',
  });

  return parseJsonResponse<SessionActionResponse>(
    response,
    'Unable to terminate all sessions.',
  );
}