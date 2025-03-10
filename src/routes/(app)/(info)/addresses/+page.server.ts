import { error, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";
import {
    genericError,
    invalidFormMessage,
    actionError,
    actionSuccess
} from "$lib/error";
import {
    addressSchema,
    deleteAddressSchema,
    updateAddressSchema
} from "$lib/address/schema";
import {
    deleteAddress,
    insertAddress,
    findUserAddresses,
    updateAddress,
    userOwnsAddress
} from "$lib/address/model";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) return error(401);

    const addresses = await findUserAddresses(user.id);
    if (!addresses)
        return error(
            500,
            "Não conseguimos carregar os dados de seus endereços. Tente novamente mais tarde"
        );

    addresses.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    return {
        addresses: addresses,
        form: {
            newAddress: await superValidate(zod(addressSchema)),
            existingAddresses: await Promise.all(
                addresses.map((address) => {
                    return superValidate(address, zod(updateAddressSchema));
                })
            )
        }
    };
};

export const actions: Actions = {
    new: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(addressSchema));
        if (!form.valid) return actionError(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return actionError(form, genericError);

        const inserted = await insertAddress(user.id, form.data);
        if (!inserted) {
            return actionError(
                form,
                "Não conseguimos adicionar o novo endereço. Tente novamente mais tarde."
            );
        }

        return actionSuccess(form, "Endereço adicionado");
    },
    update: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(updateAddressSchema));
        if (!form.valid) return actionError(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return actionError(form, genericError);

        if (!(await userOwnsAddress(form.data.id, user.id)))
            return actionError(form, genericError);

        const update = await updateAddress(form.data);
        if (!update)
            return actionError(
                form,
                "Não conseguimos modificar seu endereço. Tente novamente mais tarde."
            );

        return actionSuccess(form, "Endereço modificado");
    },
    del: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(deleteAddressSchema));
        if (!form.valid) return actionError(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return actionError(form, genericError);

        if (!(await userOwnsAddress(form.data.id, user.id)))
            return actionError(form, genericError);

        const deleted = await deleteAddress(form.data);
        if (!deleted)
            return actionError(
                form,
                "Não conseguimos excluir seu endereço. Tente novamente mais tarde."
            );

        return actionSuccess(form, "Endereço excluído");
    }
};
