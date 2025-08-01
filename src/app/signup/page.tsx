'use client';

import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const signup = trpc.auth.signup.useMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    await signup.mutateAsync({ email, password });
    router.push('/login');
  };

  return (
    <main className="p-4">
      <h2 className="text-xl font-bold mb-2">Sign Up</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-1 mb-2 block" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-1 mb-2 block" />
      <button onClick={handleSignup} className="bg-blue-500 text-white px-4 py-2">Sign Up</button>
    </main>
  );
}
