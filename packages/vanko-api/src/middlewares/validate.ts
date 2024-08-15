import { validationError } from "@/errors.ts";
import { ApiContext } from "@/types.ts";
import { Next } from "koa";
import { ZodSchema, ZodError } from "zod";

export function validateParams(schema: ZodSchema) {
    return async function (ctx: ApiContext, next: Next) {
        try {
            schema.parse(ctx.params);
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                throw validationError(err.issues[0].message);
            }

            throw err;
        }
    };
}

export function validateBody<State>(schema: ZodSchema) {
    return async function (ctx: ApiContext<State>, next: Next) {
        try {
            ctx.state = schema.parse(ctx.request.body);
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                throw validationError(err.issues[0].message);
            }

            throw err;
        }
    };
}
