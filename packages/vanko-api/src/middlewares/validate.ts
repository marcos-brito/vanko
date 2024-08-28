import { validationError } from "@/errors.ts";
import { ApiContext } from "@/types.ts";
import { Middleware } from "@koa/router";
import { Next } from "koa";
import { ZodSchema, ZodError } from "zod";

export function validateParam(schema: ZodSchema): Middleware {
    return async function(ctx: ApiContext, next: Next) {
        try {
            ctx.state.param = schema.parse(ctx.params);
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                throw validationError(err.issues[0].message);
            }

            throw err;
        }
    };
}

export function validateBody(schema: ZodSchema): Middleware {
    return async function(ctx: ApiContext, next: Next) {
        try {
            ctx.state.req = schema.parse(ctx.request.body);
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                throw validationError(err.issues[0].message);
            }

            throw err;
        }
    };
}
