import { TRPCError } from "@trpc/server"

export class Errors {
    static BadRequest = (message: string) => {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message,
        });
    }

    static Unauthorized = (message: string) => {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message,
        });
    }

    static Forbidden = (message: string) => {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message,
        });
    }
}
