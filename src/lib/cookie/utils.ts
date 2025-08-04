import { cookies } from "next/headers";

export const storeCookies = async (cookiesData: { key: string, value: string, options: { httpOnly?: boolean; secure?: boolean; path?: string; maxAge?: number }}[]) => {
    const cookieStore = await cookies();
    cookiesData.forEach(({ key, value, options }) => {
        cookieStore.set(key, value, {
            httpOnly: options.httpOnly ?? true,
            secure: options.secure ?? process.env.NODE_ENV === 'production',
            path: options.path ?? '/',
            maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // 7 days
        });
    });
};

export const deleteCookies = async (cookieNames: string[]) => {
    const cookieStore = await cookies();
    cookieNames.forEach(cookieName => {
        cookieStore.delete(cookieName);
    });
};