import Koa from "koa";
import router from "./routes/router.ts";

const app = new Koa();

app.use(router.routes());
app.listen("3000");
