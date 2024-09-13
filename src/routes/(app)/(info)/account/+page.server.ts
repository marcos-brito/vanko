import {
    changePasswordSchema,
    Gender,
    updatePersonalInfoSchema
} from "$lib/schemas";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { findUserProfile, verifyUserPassword } from "$lib/database/users";
import { genericError, invalidFormMessage } from "$lib/utils";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) redirect(401, "/");

    const profile = await findUserProfile(user?.id);
    if (!profile) {
        error(
            500,
            "Não conseguimos carregar as informações da sua conta. Tente novamente mais tarde."
        );
    }

    const fields = {
        name: profile.name,
        email: profile.email,
        cpf: profile.cpf || undefined,
        phone: profile.phone || undefined,
        gender: (profile.gender as Gender) || undefined,
        birth: profile.birth ? new Date(profile.birth) : undefined
    };

    return {
        form: {
            updateInfo: await superValidate(
                fields,
                zod(updatePersonalInfoSchema)
            ),
            changePassword: await superValidate(zod(changePasswordSchema))
        },
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
    updateInfo: async ({ request, locals: { supabase } }) => {
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
    },
    changePassword: async ({
        request,
        locals: { safeGetSession, supabase }
    }) => {
        const form = await superValidate(request, zod(changePasswordSchema));
        if (!form.valid) return message(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return message(form, genericError);

        const passwordMatch = await verifyUserPassword(user.id, form.data.old);

        if (!passwordMatch) {
            return message(form, {
                type: "error",
                text: "A senha digitada é diferente da senha atual"
            });
        }

        const { error } = await supabase.auth.updateUser({
            password: form.data.new
        });

        if (error) {
            return message(form, {
                type: "error",
                text: "Algo não deu certo ao mudar sua senha. Tente novamente mais tarde."
            });
        }

        return message(form, {
            type: "success",
            text: "Senha alterada"
        });
    }
};
