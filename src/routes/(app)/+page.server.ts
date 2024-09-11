import { signinSchema, signupSchema } from "$lib/schemas";
import { invalidFormMessage } from "$lib/utils";
import { redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod(signupSchema));
        if (!form.valid) return message(form, invalidFormMessage);

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
            return message(form, {
                type: "error",
                text: "Não conseguimos criar sua conta. Tente novamente mais tarde."
            });
        }

        return redirect(303, "/");
    },
    signin: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod(signinSchema));
        if (!form.valid) return message(form, invalidFormMessage);

        const { error } = await supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password
        });

        if (error) {
            return message(form, {
                type: "error",
                text: "Email ou senha inválidos"
            });
        }

        redirect(303, "/");
    }
};
