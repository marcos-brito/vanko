import { signinSchema, signupSchema } from "$lib/schemas";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
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
            message(form, {
                type: "error",
                text: "Não conseguimos criar sua conta. Tente novamente mais tarde."
            });
        }

        redirect(303, "/");
    },
    signin: async ({ request, locals: { supabase } }) => {
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
