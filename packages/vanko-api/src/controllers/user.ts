import { ApiContext } from "@/types.ts";
import { User, presentUser } from "@/presenters.ts";
import * as userRepository from "@/models/user.ts";
import {InternalError, notFoundError } from "@/errors.ts";
import { IdParameter, UserCreateReq } from "@/schemas/user.ts";
import argon2 from "argon2";

export async function id(ctx: ApiContext<{}, IdParameter, User>) {
    let user = await userRepository.findById(ctx.state.param.id);

    if (!user) {
        throw notFoundError("User not found");
    }

    ctx.status = 200;
    ctx.message = "User found";
    ctx.body = presentUser(user);
}

export async function create(ctx: ApiContext<UserCreateReq, User>) {
    if (
        (await userRepository.uniqueExists("email", ctx.state.email)) ||
        (await userRepository.uniqueExists("cpf", ctx.state.cpf))
    ) {
        ctx.status = 200;
        ctx.message = "Data already related to an existing account";
        return;
    }

    try {
        const user = ctx.state.req;
        user.password = await argon2.hash(user.password);
        const created = await userRepository.create(user);

        // We let the catch handle it
        if (!created) {
            throw new Error();
        }

        ctx.status = 201;
        ctx.message = "User created";
        ctx.set("Location", `${ctx.path}/users/${created?.id}`);
        ctx.body = presentUser(created);
    } catch {
        throw InternalError();
    }
}
