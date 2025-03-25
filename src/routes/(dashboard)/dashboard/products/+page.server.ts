import { err, success, errInvalid } from "$lib/error";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types";
import { presentProduct } from "$lib/product/presenter";
import { superValidate } from "sveltekit-superforms";
import { changeProductStatusSchema } from "$lib/product/schema";
import {
    activateProduct,
    deactivateProduct,
    findAllProducts
} from "$lib/product/store";

export const load: PageServerLoad = async () => {
    return {
        products: await findAllProducts().then((products) =>
            products.map(presentProduct)
        )
    };
};

export const actions: Actions = {
    changeStatus: async ({ request }) => {
        const form = await superValidate(
            request,
            zod(changeProductStatusSchema)
        );

        if (!form.valid) return err(form, errInvalid);
        if (form.data.kind === "activate")
            await activateProduct(form.data.id, form.data.reason);
        if (form.data.kind === "deactivate")
            await deactivateProduct(form.data.id, form.data.reason);

        return success(form, "Status atualizado");
    }
};
