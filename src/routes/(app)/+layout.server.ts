import { signinSchema, signupSchema } from "$lib/schemas";
import { zod } from "sveltekit-superforms/adapters";
import type { LayoutServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";

export const load: LayoutServerLoad = async () => {
    return {
        form: {
            signup: await superValidate(zod(signupSchema)),
            signin: await superValidate(zod(signinSchema))
        }
    };
};
