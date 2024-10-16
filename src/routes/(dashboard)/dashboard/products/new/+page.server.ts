import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { invalidFormMessage, actionError, actionSuccess } from "$lib/error";
import {
    newCategorySchema,
    newPricingGroup,
    newProductSchema,
    newTypeSchema
} from "$lib/product/schema";
import {
    findCategories,
    findPricingGroups,
    findTypes,
    insertProduct
} from "$lib/product/model";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) error(404);

    return {
        form: await superValidate(zod(newProductSchema)),
        categories: await findCategories(),
        pricing_groups: await findPricingGroups(),
        types: await findTypes()
    };
};

export const actions: Actions = {
    newProduct: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod(newProductSchema));
        if (!form.valid) return actionError(form, invalidFormMessage);

        const created = await insertProduct(form.data);
        if (!created)
            return actionError(
                form,
                "Algo deu errado ao cadastrar o produto. Tente novamente mais tarde."
            );

        for (let [idx, image] of form.data.images.entries()) {
            const { error } = await supabase.storage
                .from("products")
                .upload(`${created.id}/${idx}`, image);

            console.log(error);
            if (error)
                return actionError(
                    form,
                    "Ocorreu um erro fazendo upload das imagens. Tente novamente usando a página do produto."
                );
        }

        return actionSuccess(form, "Produto cadastrado.");
    },
    newCategory: async (req) => {
        const form = await superValidate(req, zod(newCategorySchema));
        if (!form.valid) return actionError(form, invalidFormMessage);
    },
    newType: async (req) => {
        const form = await superValidate(req, zod(newTypeSchema));
        if (!form.valid) return actionError(form, invalidFormMessage);
    },
    newPricingGroup: async (req) => {
        const form = await superValidate(req, zod(newPricingGroup));
        if (!form.valid) return actionError(form, invalidFormMessage);
    }
};
