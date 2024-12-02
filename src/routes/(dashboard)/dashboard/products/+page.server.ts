import { actionError, genericError } from "$lib/error";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { changeProductStatusSchema } from "$lib/product/schema";
import {
    activateProduct,
    countProducts,
    deactivateProduct,
    findAllProducts
} from "$lib/product/model";

export const load: PageServerLoad = async () => {
    return {
        products: await findAllProducts(),
        productsCount: await countProducts()
    };
};

export const actions: Actions = {
    changeStatus: async ({ request }) => {
        const form = await superValidate(
            request,
            zod(changeProductStatusSchema)
        );

        if (!form.valid) return actionError(form, genericError);
        if (form.data.kind === "activate")
            await activateProduct(form.data.id, form.data.reason);
        if (form.data.kind === "deactivate")
            await deactivateProduct(form.data.id, form.data.reason);

        return { form };
    }
};
