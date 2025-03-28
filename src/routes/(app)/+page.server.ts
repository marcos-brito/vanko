import { signinSchema, signupSchema } from "$lib/auth/schema";
import { err, errInvalid } from "$lib/error";
import { redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod(signupSchema));
        if (!form.valid) return err(form, errInvalid);

        const { error } = await supabase.auth.signUp({
            email: form.data.email,
            password: form.data.password,
            options: {
                data: {
                    name: form.data.name
                }
            }
        });

        if (error)
            err(
                form,
                "Não conseguimos criar sua conta. Tente novamente mais tarde."
            );

        return redirect(303, "/");
    },
    signin: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod(signinSchema));
        if (!form.valid) return err(form, errInvalid);

        const { error } = await supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password
        });

        if (error) err(form, "Email ou senha inválidos");

        redirect(303, "/");
    }
};
