import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export async function createContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const payload = token ? verifyJwt(token) : null;

  const userId = payload?.userId || null;
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

  return {
    prisma,
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
