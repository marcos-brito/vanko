import { ApiContext } from "@/types.ts";
import { User, presentUser } from "@/presenters.ts";
import * as userRepository from "@/models/user.ts";
import { notFoundError } from "@/errors.ts";

export async function id(ctx: ApiContext<{}, User>) {
    let user = await userRepository.findById(Number(ctx.params.id));

    if (!user) {
        throw notFoundError("User not found");
    }

    ctx.status = 200;
    ctx.message = "User found";
    ctx.body = presentUser(user);
}
}
