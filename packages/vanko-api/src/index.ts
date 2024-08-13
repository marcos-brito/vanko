import "dotenv/config";
import Koa from "koa";
import router from "@/routes/router.ts";
import logger from "@/logger.ts";

const port = process.env.PORT;
const app = new Koa();

app.on("error", (err) => {
    logger.error(err);
});

app.use(router.routes());
app.listen(port);

logger.info(`Server listening at ${port}`);
