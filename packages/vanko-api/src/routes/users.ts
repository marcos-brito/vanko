import Router from "@koa/router";
import * as userController from "@/controllers/user.ts";
import { validateParams } from "@/middlewares/validate.ts";
import { z } from "zod";

const usersRouter = new Router();

usersRouter.get(
    "/:id",
    validateParams(z.object({ id: z.coerce.number() })),
    userController.id
);

export default usersRouter;
