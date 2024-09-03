import "dotenv/config";
import { init } from "@/index.ts";
import { pingDatabase } from "./db.ts";
import logger from "./logger.ts";
import Koa from "koa";

const app = new Koa();
const port = process.env.PORT;

init(app);

app.listen(port);
logger.info(`Server listening at ${port}`);
await pingDatabase();
