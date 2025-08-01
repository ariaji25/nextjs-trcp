'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import SuperJSON from 'superjson';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: SuperJSON
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
