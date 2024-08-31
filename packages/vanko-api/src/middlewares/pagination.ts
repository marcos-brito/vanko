import { validationError } from "@/errors.ts";
import { Pagination, paginationSchema } from "@/schemas/index.ts";
import { ApiContext } from "@/types.ts";
import { Middleware } from "@koa/router";
import { Next } from "koa";
import { ZodError } from "zod";

export type PageCounter = (pagination: Pagination) => Promise<number>;

/**
 * Middleware to parse pagination query parameters. It also
 * sets response headers with some metadata:
 * - X-Pagination-Page
 * - X-Pagination-Page-Size
 * - X-Pagination-Page-Count
 *
 * @param pageCounter - A function that returns the maximum number of pages
 */
export function pagination(pageCounter: PageCounter): Middleware {
    return async function (ctx: ApiContext, next: Next) {
        try {
            ctx.state.pagination = paginationSchema.parse(ctx.query);

            ctx.response.set(
                "X-Pagination-Page",
                ctx.state.pagination.page.toString()
            );

            ctx.response.set(
                "X-Pagination-Page-Size",
                ctx.state.pagination.pageSize.toString()
            );

            ctx.response.set(
                "X-Pagination-Page-Count",
                (await pageCounter(ctx.state.pagination)).toString()
            );

            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                throw validationError(err.issues[0].message);
            }

            throw err;
        }
    };
}
