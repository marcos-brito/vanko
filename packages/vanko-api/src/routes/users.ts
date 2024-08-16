import Router from "@koa/router";
import { koaBody } from "koa-body";
import * as userController from "@/controllers/user.ts";
import { validateBody, validateParam } from "@/middlewares/validate.ts";
import {
    IdParameterSchema,
    UserCreateSchema,
    UserPatchSchema,
    UserUpdateSchema
} from "@/schemas/user.ts";

const usersRouter = new Router();

usersRouter.post(
    "/",
    koaBody(),
    validateBody(UserCreateSchema),
    userController.create
);

usersRouter.get("/:id", validateParam(IdParameterSchema), userController.id);

usersRouter.put(
    "/:id",
    koaBody(),
    validateParam(IdParameterSchema),
    validateBody(UserUpdateSchema),
    userController.update
);

usersRouter.patch(
    "/:id",
    koaBody(),
    validateParam(IdParameterSchema),
    validateBody(UserPatchSchema),
    userController.patch
);

export default usersRouter;
