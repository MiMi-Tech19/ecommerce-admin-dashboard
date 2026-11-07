import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeAllSessions } from '../services/sessions';

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeAllSessions,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activeSessions'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['sessionHistory'],
      });
    },
  });
}