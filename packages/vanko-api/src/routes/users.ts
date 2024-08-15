import Router from "@koa/router";
import * as userController from "@/controllers/user.ts";
import { validateBody, validateParams } from "@/middlewares/validate.ts";
import { z } from "zod";
import { UserCreateReq, UserCreateSchema } from "@/schemas/user.ts";
import { koaBody } from "koa-body";

const usersRouter = new Router();

usersRouter.post(
    "/",
    koaBody(),
    validateBody<UserCreateReq>(UserCreateSchema),
    userController.create
);

usersRouter.get(
    "/:id",
    validateParams(z.object({ id: z.coerce.number() })),
    userController.id
);

export default usersRouter;
