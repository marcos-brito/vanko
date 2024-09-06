import Router from "@koa/router";
import { koaBody } from "koa-body";
import * as userController from "@/controllers/user.ts";
import * as addressController from "@/controllers/address.ts";
import { validateBody, validateParam } from "@/middlewares/validate.ts";
import {
    addressCreateSchema,
    IdParameterSchema,
    UserCreateSchema,
    UserPatchSchema,
    UserUpdateSchema
} from "@/schemas/index.ts";
import { pagination } from "@/middlewares/pagination.ts";
import { countPages } from "@/models/user.ts";

const usersRouter = new Router();

usersRouter.get("/", pagination(countPages), userController.all);

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

usersRouter.del(
    "/:id",
    koaBody(),
    validateParam(IdParameterSchema),
    userController.del
);

usersRouter.get(
    "/:id/addresses",
    validateParam(IdParameterSchema),
    addressController.byUser
);

usersRouter.post(
    "/:id/addresses",
    koaBody(),
    validateParam(IdParameterSchema),
    validateBody(addressCreateSchema),
    addressController.create
);

export default usersRouter;
