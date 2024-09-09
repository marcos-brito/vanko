import { Gender, updatePersonalInfoSchema } from "$lib/schemas/account.js";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";
import { findUserProfile } from "$lib/supabase/user.js";
import { invalidFormMessage } from "$lib/utils.js";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const {
        error,
        data: { user }
    } = await supabase.auth.getUser();
    const profile = await findUserProfile(user!.id);

    if (error) {
        console.log(error);
    }

    const fields = {
        name: profile.name!,
        email: profile.email!,
        cpf: profile.cpf || undefined,
        phone: profile.phone || undefined,
        gender: (profile.gender as Gender) || undefined,
        birth: profile.birth ? new Date(profile.birth) : undefined
    };

    return {
        form: await superValidate(fields, zod(updatePersonalInfoSchema)),
        profile: {
            nome: fields.name,
            email: fields.email,
            CPF: fields.cpf,
            telefone: fields.phone,
            Gênero: fields.gender,
            "Data de nascimento": fields.birth
        }
    };
};

export const actions: Actions = {
    default: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(
            request,
            zod(updatePersonalInfoSchema)
        );

        if (!form.valid) {
            return message(form, invalidFormMessage);
        }

        const { email, ...rest } = form.data;
        const { error } = await supabase.auth.updateUser({
            email: email,
            data: { ...rest }
        });

        if (error) {
            return message(form, {
                type: "error",
                text: "Desculpe. Não conseguimos atualizar seus dados. Tente novamente mais tarde"
            });
        }

        return message(form, {
            type: "success",
            text: "Dados alterados"
        });
    }
};
