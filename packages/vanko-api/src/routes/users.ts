import Router from "@koa/router";
import { UserCreateReq, UserCreateSchema } from "@/schemas/user.ts";
import { koaBody } from "koa-body";
import * as userController from "@/controllers/user.ts";
import { validateBody, validateParam } from "@/middlewares/validate.ts";

const usersRouter = new Router();

usersRouter.post(
    "/",
    koaBody(),
    validateBody(UserCreateSchema),
    userController.create
);

usersRouter.get(
    "/:id",
    validateParams(z.object({ id: z.coerce.number() })),
    userController.id
);

export default usersRouter;
