import { error, redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";
import { genericError, invalidFormMessage } from "$lib/utils.js";
import { findUserAddresses } from "$lib/database/users";
import {
    addressSchema,
    deleteAddressSchema,
    ResidenceType,
    updateAddressSchema
} from "$lib/schemas/address.js";
import {
    deleteAddress,
    insertAddress,
    updateAddress,
    userOwnsAddress
} from "$lib/database/address.js";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) return redirect(404, "/");

    const addresses = await findUserAddresses(user.id);
    if (!addresses)
        return error(
            500,
            "Não conseguimos carregar os dados de seus endereços. Tente novamente mais tarde"
        );
    addresses.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    const formData = addresses.map((address) => {
        const { state, country, residence_type, ...rest } = address;
        return {
            state: state.name,
            country: country.name,
            residence_type: residence_type as ResidenceType,
            ...rest
        };
    });

    return {
        addresses: formData,
        form: {
            newAddress: await superValidate(zod(addressSchema)),
            existingAddresses: await Promise.all(
                formData.map((address) => {
                    return superValidate(address, zod(updateAddressSchema));
                })
            )
        }
    };
};

export const actions: Actions = {
    new: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(addressSchema));
        if (!form.valid) return message(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return message(form, genericError);

        const inserted = await insertAddress(user.id, form.data);
        if (!inserted) {
            return message(form, {
                type: "error",
                text: "Não conseguimos adicionar o novo endereço. Tente novamente mais tarde."
            });
        }

        return message(form, {
            type: "success",
            text: "Endereço adicionado"
        });
    },
    update: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(updateAddressSchema));
        if (!form.valid) return message(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return message(form, genericError);

        if (!(await userOwnsAddress(form.data.id, user.id)))
            return message(form, genericError);

        const update = await updateAddress(form.data);
        if (!update)
            return message(form, {
                type: "error",
                text: "Não conseguimos modificar seu endereço. Tente novamente mais tarde."
            });

        return message(form, {
            type: "success",
            text: "Endereço modificado"
        });
    },
    del: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(deleteAddressSchema));
        if (!form.valid) return message(form, invalidFormMessage);

        const { user } = await safeGetSession();
        if (!user) return message(form, genericError);

        if (!(await userOwnsAddress(form.data.id, user.id)))
            return message(form, genericError);

        const deleted = await deleteAddress(form.data);
        if (!deleted)
            return message(form, {
                type: "error",
                text: "Não conseguimos excluir seu endereço. Tente novamente mais tarde."
            });

        return message(form, {
            type: "success",
            text: "Endereço excluído"
        });
    }
};
