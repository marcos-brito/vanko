import Router from "@koa/router";
import usersRouter from "@/routes/users.ts";
import addressesRouter from "@/routes/addresses.ts";

const router = new Router();

router.use("/users", usersRouter.routes(), usersRouter.allowedMethods());
router.use(
    "/addresses",
    addressesRouter.routes(),
    addressesRouter.allowedMethods()
);

export default router;
