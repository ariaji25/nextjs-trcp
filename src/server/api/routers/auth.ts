import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../trpc';
import { hashPassword, verifyPassword, signJwt } from '@/lib/auth/utils';
import { cookies } from 'next/headers';

export const authRouter = router({
  signup: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ input, ctx }) => {
      const hashed = await hashPassword(input.password);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashed,
        },
      });

      return { id: user.id, email: user.email };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });

      if (!user) throw new Error('Invalid credentials');

      const isValid = await verifyPassword(input.password, user.password);
      if (!isValid) throw new Error('Invalid credentials');

      const token = signJwt({ userId: user.id });
      (await cookies()).set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return { id: user.id, email: user.email };
    }),

  me: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) return null;
    return { id: ctx.user.id, email: ctx.user.email };
  }),
  
  secretMessage: protectedProcedure.query(({ ctx }) => {
    return {
      message: `You are logged in as ${ctx.user.email}`,
    };
  }),
});
