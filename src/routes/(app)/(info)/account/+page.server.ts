import { error, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { findUserProfile } from "$lib/account/store";
import { verifyUserPassword } from "$lib/auth/model";
import { mapProfile } from "$lib/account/presenters";
import {
    changePassword,
    updatePersonalInfo
} from "$lib/account/schema";
import {
    err,
    success,
    errInvalid,
    errGeneric
} from "$lib/error";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) redirect(401, "/");

    const profile = await findUserProfile(user.id);
    if (!profile)
        error(
            500,
            "Não conseguimos carregar as informações da sua conta. Tente novamente mais tarde."
        );

    return {
        form: {
            update: await superValidate(
                mapProfile(profile),
                zod(updatePersonalInfo)
            ),
            changePassword: await superValidate(zod(changePassword))
        },
        profile: mapProfile(profile)
    };
};

export const actions: Actions = {
    update: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(
            request,
            zod(updatePersonalInfo)
        );

        if (!form.valid) return err(form, errInvalid);

        const { email, ...rest } = form.data;
        const { error } = await supabase.auth.updateUser({
            email: email || undefined,
            data: { ...rest }
        });

        if (error)
            return err(
                form,
                "Desculpe. Não conseguimos atualizar seus dados. Tente novamente mais tarde"
            );

        return success(form, "Dados alterados");
    },
    changePassword: async ({
        request,
        locals: { safeGetSession, supabase }
    }) => {
        const form = await superValidate(request, zod(changePassword));
        if (!form.valid) return err(form, errInvalid);

        const { user } = await safeGetSession();
        if (!user) return err(form, errGeneric);

        const passwordMatch = await verifyUserPassword(user.id, form.data.old);
        if (!passwordMatch)
            return err(
                form,
                "A senha digitada é diferente da senha atual"
            );

        const { error } = await supabase.auth.updateUser({
            password: form.data.new
        });
        if (error) return err(form, errGeneric);

        return success(form, "Senha alterada");
    }
};
