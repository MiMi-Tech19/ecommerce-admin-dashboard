
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRole } from '../services/users';
import type { UserRole } from '../types/auth';

interface UpdateUserRoleVariables {
  id: string;
  role: UserRole;
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: UpdateUserRoleVariables) =>
      updateUserRole(id, role),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
}
