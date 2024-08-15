import "dotenv/config";
import Koa from "koa";
import router from "@/router.ts";
import koalogger from "koa-logger";
import logger from "@/logger.ts";

const port = process.env.PORT;
export const app = new Koa();

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
            data: ctx.body
        };
    } catch (err: any) {
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
app.listen(port);

logger.info(`Server listening at ${port}`);
