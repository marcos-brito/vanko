import { error, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { findUserProfile } from "$lib/account/model";
import { verifyUserPassword } from "$lib/auth/model";
import {
    actionError,
    actionSuccess,
    invalidFormMessage,
    genericError
} from "$lib/error";
import {
    changePasswordSchema,
    Gender,
    updatePersonalInfoSchema
} from "$lib/account/schema";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) redirect(401, "/");

    const profile = await findUserProfile(user.id);
    if (!profile) {
        error(
            500,
            "Não conseguimos carregar as informações da sua conta. Tente novamente mais tarde."
        );
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

        if (!form.valid) return actionError(form, invalidFormMessage);

        const { email, ...rest } = form.data;
        const { error } = await supabase.auth.updateUser({
            email: email,
            data: { ...rest }
        });

        if (error)
            return actionError(
                form,
                "Desculpe. Não conseguimos atualizar seus dados. Tente novamente mais tarde"
            );

        return actionSuccess(form, "Dados alterados");
    },
    changePassword: async ({
        request,
        locals: { safeGetSession, supabase }
    }) => {
        const form = await superValidate(request, zod(changePasswordSchema));
        if (!form.valid) return actionError(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return actionError(form, genericError);

        const passwordMatch = await verifyUserPassword(user.id, form.data.old);
        if (!passwordMatch)
            return actionError(
                form,
                "A senha digitada é diferente da senha atual"
            );

        const { error } = await supabase.auth.updateUser({
            password: form.data.new
        });
        if (error) return actionError(form, genericError);

        return actionSuccess(form, "Senha alterada");
    }
};
