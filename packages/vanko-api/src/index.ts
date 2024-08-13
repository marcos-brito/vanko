import Koa from "koa";
import router from "@/routes/router.ts";
import logger from "@/logger.ts";

const app = new Koa();

app.on("error", (err) => {
    logger.error(err);
});

app.use(router.routes());
app.listen("3000");

logger.info(`Server listening at 3000`);
