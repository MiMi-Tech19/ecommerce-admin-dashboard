import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeSession } from '../services/sessions';

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['activeSessions'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['sessionHistory'],
        }),
      ]);
    },
  });
}