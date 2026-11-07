
import { apiFetch } from './api';
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
}

interface UpdateUserRoleResponse {
  success: boolean;
  message: string;
  user: ManagedUser;
}

export async function getUsers(): Promise<ManagedUser[]> {
  const response = await apiFetch(USERS_ENDPOINT);

  const data = (await response.json()) as GetUsersResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.message || 'Unable to fetch users.');
  }

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

  const data = (await response.json()) as UpdateUserRoleResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.message || 'Unable to update user role.');
  }

  return data;
}
