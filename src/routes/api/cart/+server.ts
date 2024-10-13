import type { RequestHandler } from "./$types";
import { storeCart } from "$lib/cart/model";
import { z } from "zod";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({
    request,
    locals: { safeGetSession }
}) => {
    try {
        const schema = z.record(z.string(), z.number());
        const { user } = await safeGetSession();
        if (!user) return;

        const maybeCart = await request.json();
        const cart = schema.parse(maybeCart);
        await storeCart(user.id, cart);
        return json(cart, { status: 200 });
    } catch {
        return json({}, { status: 500 });
    }
};
