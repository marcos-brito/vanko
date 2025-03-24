import { error, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";
import { errGeneric, errInvalid, err, success } from "$lib/error";
import { presentAddress } from "$lib/address/presenter.js";
import {
    createAddressSchema,
    deleteAddressSchema,
    updateAddressSchema
} from "$lib/address/schema";
import {
    deleteAddress,
    insertAddress,
    findUserAddresses,
    updateAddress,
    userOwnsAddress
} from "$lib/address/store.js";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) return error(401);

    const addresses = await findUserAddresses(user.id);

    if (addresses.some((address) => !address))
        return error(
            500,
            "Não conseguimos carregar os dados de seus endereços. Tente novamente mais tarde"
        );

    return {
        addresses: addresses.map((address) => presentAddress(address)),
        form: {
            newAddress: await superValidate(zod(createAddressSchema)),
            existingAddresses: await Promise.all(
                addresses.map((address) => {
                    return superValidate(
                        presentAddress(address),
                        zod(updateAddressSchema)
                    );
                })
            )
        }
    };
};

export const actions: Actions = {
    new: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(createAddressSchema));
        if (!form.valid) return err(form, errInvalid);

        const { user } = await safeGetSession();
        if (!user) return err(form, errGeneric);

        const inserted = await insertAddress({
            ...form.data,
            user: user.id
        });

        if (!inserted)
            return err(
                form,
                "Não conseguimos adicionar o novo endereço. Tente novamente mais tarde."
            );

        return success(form, "Endereço adicionado");
    },
    update: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(updateAddressSchema));
        if (!form.valid) return err(form, errInvalid);

        const { user } = await safeGetSession();
        if (!user) return err(form, errGeneric);

        const userOwns = await userOwnsAddress(form.data.id, user.id);
        if (!userOwns) return err(form, errGeneric);

        const update = await updateAddress(form.data.id, {
            ...form.data
        });

        if (!update)
            return err(
                form,
                "Não conseguimos modificar seu endereço. Tente novamente mais tarde."
            );

        return success(form, "Endereço modificado");
    },
    del: async ({ request, locals: { safeGetSession } }) => {
        const form = await superValidate(request, zod(deleteAddressSchema));
        if (!form.valid) return err(form, errInvalid);

        const { user } = await safeGetSession();
        if (!user) return err(form, errGeneric);

        const userOwns = await userOwnsAddress(form.data.id, user.id);
        if (!userOwns) return err(form, errGeneric);

        const deleted = await deleteAddress(form.data.id);
        if (!deleted)
            return err(
                form,
                "Não conseguimos excluir seu endereço. Tente novamente mais tarde."
            );

        return success(form, "Endereço excluído");
    }
};
