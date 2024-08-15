import "dotenv/config";
import Koa from "koa";
import router from "@/router.ts";
import logger from "@/logger.ts";

const port = process.env.PORT;
export const app = new Koa();

app.on("error", (err) => {
    logger.error(err);
});

app.use(router.routes());
app.listen(port);

logger.info(`Server listening at ${port}`);
