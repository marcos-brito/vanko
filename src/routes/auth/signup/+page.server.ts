import { signupSchema } from "$lib/schemas/auth.js";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const actions: Actions = {
    default: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod(signupSchema));

        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const { error } = await supabase.auth.signUp({
            email: form.data.email,
            password: form.data.password,
            options: {
                data: {
                    name: form.data.name
                }
            }
        });

        if (error) {
            console.error(error);
            redirect(303, "/auth/error");
        } else {
            redirect(303, "/");
        }
    }
};
