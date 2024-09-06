import Router from "@koa/router";
import * as addressController from "@/controllers/address.ts";
import { addressPatchSchema, IdParameterSchema } from "@/schemas/index.ts";
import { validateBody, validateParam } from "@/middlewares/validate.ts";
import koaBody from "koa-body";

const addressesRouter = new Router();

addressesRouter.patch(
    "/:id",
    validateParam(IdParameterSchema),
    koaBody(),
    validateBody(addressPatchSchema),
    addressController.patch
);

addressesRouter.del(
    "/:id",
    validateParam(IdParameterSchema),
    addressController.del
);

export default addressesRouter;
