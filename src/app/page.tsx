'use client';

import { trpc } from '@/utils/trpc';

export default function Home() {
  const me = trpc.auth.me.useQuery();
  const secret = trpc.auth.secretMessage.useQuery(undefined, {
    enabled: !!me.data, // only try if user is logged in
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>

      {me.data ? (
        <>
          <p>Logged in as: {me.data.email}</p>
          <p className="mt-4 text-green-600">{secret.data?.message}</p>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </main>
  );
}
