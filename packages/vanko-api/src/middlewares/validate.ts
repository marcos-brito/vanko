import { validationError } from "@/errors.ts";
import { ApiContext } from "@/types.ts";
import { Middleware } from "@koa/router";
import { Next } from "koa";
import { ZodSchema, ZodError } from "zod";

export function validateParam(schema: ZodSchema): Middleware {
    return async function (ctx: ApiContext, next: Next) {
        try {
            ctx.state.param = schema.parse(ctx.params);
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                throw validationError(
                    `Bad parameters:\n${stringfyZodError(err)}`
                );
            }

            throw err;
        }
    };
}

export function validateBody(schema: ZodSchema): Middleware {
    return async function (ctx: ApiContext, next: Next) {
        try {
            ctx.state.req = schema.parse(ctx.request.body);
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                throw validationError(`Bad body:\n${stringfyZodError(err)}`);
            }

            throw err;
        }
    };
}

function stringfyZodError(error: ZodError): string {
    let str = [];

    for (let issue of error.issues) {
        str.push(`${issue.path[0]}: ${issue.message}`);
    }

    return str.join("\n");
}
