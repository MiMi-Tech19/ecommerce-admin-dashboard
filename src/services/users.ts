import { apiFetch, parseJsonResponse } from './api';
import type { UserRole } from '../types/auth';

const USERS_ENDPOINT = '/api/users';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface GetUsersResponse {
  success: boolean;
  users: ManagedUser[];
  message?: string;
}

interface UpdateUserRoleResponse {
  success: boolean;
  message: string;
  user: ManagedUser;
}

interface UpdateMyProfileResponse {
  success: boolean;
  message: string;
  user: ManagedUser;
}

export async function getUsers(): Promise<ManagedUser[]> {
  const response = await apiFetch(USERS_ENDPOINT);

  const data = await parseJsonResponse<GetUsersResponse>(
    response,
    'Unable to fetch users.',
  );

  return data.users;
}

export async function updateUserRole(
  id: string,
  role: UserRole,
): Promise<UpdateUserRoleResponse> {
  const response = await apiFetch(
    `${USERS_ENDPOINT}/${encodeURIComponent(id)}/role`,
    {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    },
  );

  return parseJsonResponse<UpdateUserRoleResponse>(
    response,
    'Unable to update user role.',
  );
}

export async function updateMyProfile(
  name: string,
): Promise<UpdateMyProfileResponse> {
  const response = await apiFetch(`${USERS_ENDPOINT}/me`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });

  return parseJsonResponse<UpdateMyProfileResponse>(
    response,
    'Unable to update profile.',
  );
}