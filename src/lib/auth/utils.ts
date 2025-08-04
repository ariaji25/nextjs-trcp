import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-refresh-secret-key';

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export function signJwt(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' });
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

export function signRefreshToken(payload: object) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, REFRESH_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

export function refreshToken(token: string, refreshToken: string, payload: { userId: string }) {
    const currentPayload = verifyJwt(token);
    
    if (currentPayload && currentPayload.userId === payload.userId) {
        return { token, refreshToken };
    }

    const refreshTokenPayload = verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload || refreshTokenPayload.userId !== payload.userId) {
        throw new Error('Invalid refresh token');
    }
    
    const newToken = signJwt({ userId: payload.userId });
    const newRefreshToken = signRefreshToken({ userId: payload.userId });

    return { token: newToken, refreshToken: newRefreshToken };
}