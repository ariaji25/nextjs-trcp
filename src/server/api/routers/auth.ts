import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../trpc';
import { hashPassword, verifyPassword, signJwt, signRefreshToken, verifyRefreshToken } from '@/lib/auth/utils';
import { cookies } from 'next/headers';
import { deleteCookies, storeCookies } from '@/lib/cookie/utils';
import { AuthService } from '@/server/services/auth.service';
import { Errors } from '@/lib/errors/utils';
import { TRPCError } from '@trpc/server';

const service = new AuthService();

export const authRouter = router({
  signup: publicProcedure
    .input(z.object({ email: z.email(), password: z.string().min(6) }))
    .mutation(async ({ input, ctx }) => {
      return service.signUp(ctx, input);
    }),

  login: publicProcedure
    .input(z.object({ email: z.email(), password: z.string().min(6) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { token, refreshToken, user } = await service.login(ctx, input);
        await storeCookies([
          { key: 'token', value: token, options: { maxAge: 60 * 60 } },
          { key: 'refreshToken', value: refreshToken, options: { maxAge: 60 * 60 * 24 * 30 } },
        ]);

        return { id: user.id, email: user.email };
      } catch (error) {
        console.error('Login error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new Error('Login failed');
      }
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

  refreshToken: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshToken')?.value;

      if (!refreshToken) return Errors.Unauthorized('No refresh token found');

      const { token, refreshToken: newRefreshToken } = await service.refreshToken(ctx, refreshToken);
      await storeCookies([
        { key: 'token', value: token, options: { maxAge: 60 * 60 * 24 * 7 } },
        { key: 'refreshToken', value: newRefreshToken, options: { maxAge: 60 * 60 * 24 * 30 } },
      ])
      return { token: token, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Refresh token error:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new Error('Failed to refresh token');
    }
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await deleteCookies(['token', 'refreshToken']);
    return { message: 'Logged out successfully' };
  }),
});
