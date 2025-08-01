'use client';

import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const login = trpc.auth.login.useMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login.mutateAsync({ email, password });
    router.push('/');
  };

  return (
    <main className="p-4">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-1 mb-2 block" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-1 mb-2 block" />
      <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2">Login</button>
    </main>
  );
}
