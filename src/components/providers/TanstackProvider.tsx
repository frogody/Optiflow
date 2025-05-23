'use client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

export default function TanstackProvider({ children }: { children: React.ReactNode }): JSX.Element {
  // Use state to ensure QueryClient is only created once per component instance
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
  queries: { // Optional: Default query options
  staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // Adjust as needed
          },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      { /* Optional: Add React Query DevTools for debugging */    } 
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 