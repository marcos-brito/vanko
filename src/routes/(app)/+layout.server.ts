import { signinSchema, signupSchema } from "$lib/auth/schema";
import { zod } from "sveltekit-superforms/adapters";
import type { LayoutServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { loadCart } from "$lib/cart/model";

export const load: LayoutServerLoad = async ({
    locals: { safeGetSession }
}) => {
    const { user } = await safeGetSession();
    const cart = user ? await loadCart(user.id) : undefined;

    return {
        cart,
        form: {
            signup: await superValidate(zod(signupSchema)),
            signin: await superValidate(zod(signinSchema))
        }
    };
};
