import { QueryClient } from '@tanstack/react-query';

const ONE_HOUR_MS = 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_HOUR_MS,
      retry: 2,
    },
  },
});
