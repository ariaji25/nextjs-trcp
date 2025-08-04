// src/app/server-side/page.tsx
import { appRouter } from '@/server/api/routers/root';
import { createContext } from '@/server/context';

export default async function ServerPage() {
    const ctx = await createContext();
    const caller = appRouter.createCaller(ctx);

    const me = await caller.auth.me(); // SSR call to tRPC
    const secret = await caller.auth.secretMessage();

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">Server Side Page</h1>
            {me ? (
                <>
                    <p>User: {me.email}</p>
                    <p className="text-green-600">{secret.message}</p>
                </>
            ) : (
                <p>Not logged in</p>
            )}
        </main>
    );
}
