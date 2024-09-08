import { signinSchema } from "$lib/schemas/auth.js";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const actions: Actions = {
    default: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod(signinSchema));

        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password
        });

        if (error) {
            console.error(error);
            redirect(303, "/auth/error");
        } else {
            redirect(303, "/");
        }
    }
};
