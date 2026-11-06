import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateUserRole } from '../services/users';
import type { UserRole } from '../types/auth';

interface UpdateUserRoleVariables {
  id: string;
  role: UserRole;
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ id, role }: UpdateUserRoleVariables) =>
      updateUserRole(id, role, token),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
}