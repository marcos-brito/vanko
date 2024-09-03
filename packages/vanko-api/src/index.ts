export * from "./schemas/user.ts";
export * from "./presenters.ts";

import Koa from "koa";
import router from "@/router.ts";
import koalogger from "koa-logger";
import logger from "@/logger.ts";

export function init(app: Koa) {
    app.use(
        koalogger((str: string) => {
            logger.info(str);
        })
    );

    app.use(async (ctx, next) => {
        try {
            await next();

            ctx.body = {
                status: "sucess",
                data: ctx.body,
                message: ctx.message
            };
        } catch (err: any) {
            logger.error(err.message);
            ctx.status = err.status || 500;

            if (!err.expose || !err.message) {
                err.message = "Internal server error";
            }

            ctx.body = {
                status: "error",
                error: {
                    scope: err.scope || "internal_error",
                    message: err.message
                }
            };
        }
    });

    app.use(router.routes());
}
