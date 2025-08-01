// src/app/api/trpc/[trpc]/route.ts
import { appRouter } from '@/server/api/routers/root';
import { createContext } from '@/server/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
