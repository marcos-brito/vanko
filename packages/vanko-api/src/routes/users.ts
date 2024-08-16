import Router from "@koa/router";
import { koaBody } from "koa-body";
import * as userController from "@/controllers/user.ts";
import { validateBody, validateParam } from "@/middlewares/validate.ts";
import {
    IdParameterSchema,
    UserCreateSchema,
} from "@/schemas/user.ts";

const usersRouter = new Router();

usersRouter.post(
    "/",
    koaBody(),
    validateBody(UserCreateSchema),
    userController.create
);

usersRouter.get(
    "/:id",
    validateParam(IdParameterSchema),
    userController.id
);

export default usersRouter;
