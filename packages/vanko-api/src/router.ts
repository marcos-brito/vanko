import Router from "@koa/router";
import usersRouter from "@/routes/users.ts";

const router = new Router();

router.use("/users", usersRouter.routes(), usersRouter.allowedMethods());

export default router;
