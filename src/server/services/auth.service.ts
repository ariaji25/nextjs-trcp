import { hashPassword, signJwt, signRefreshToken, verifyPassword, verifyRefreshToken } from "@/lib/auth/utils";
import { Context } from "../context";
import { Errors } from "@/lib/errors/utils";

export class AuthService {
    private async isUserExists(ctx: Context, email: string) {
        const user = await ctx.prisma.user.findUnique({
            where: { email },
        });

        return !!user;
    }

    async signUp(ctx: Context, input: { email: string, password: string }) {
        // Check if user already exists
        const userExists = await this.isUserExists(ctx, input.email);
        if (userExists) {
           return Errors.BadRequest('User already exists');
        }

        // Hash the password and create user
        const hashed = await hashPassword(input.password);
        const user = await ctx.prisma.user.create({
            data: {
                email: input.email,
                password: hashed,
            },
        });

        return { id: user.id, email: user.email };
    }

    async login(ctx: Context, input: { email: string, password: string }) {
        const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });

        if (!user) return Errors.Unauthorized('Invalid credentials');

        const isValid = await verifyPassword(input.password, user.password);
        if (!isValid) return Errors.Unauthorized('Invalid credentials');

        const token = signJwt({ userId: user.id });
        const refreshToken = signRefreshToken({ userId: user.id });

        return { token, refreshToken, user };
    }

    async refreshToken(ctx: Context, refreshToken: string) {
        if (!refreshToken) return Errors.Unauthorized('No refresh token found');
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) return Errors.Unauthorized('Invalid refresh token');

        const user = await ctx.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) return Errors.Unauthorized('User not found');

        const newToken = signJwt({ userId: user.id });
        const newRefreshToken = signRefreshToken({ userId: user.id });

        return { token: newToken, refreshToken: newRefreshToken }
    }

}