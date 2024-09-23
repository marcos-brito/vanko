import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { message, superValidate } from "sveltekit-superforms";
import {
    newCategorySchema,
    newPricingGroup,
    newProductSchema,
    newTypeSchema
} from "$lib/schemas/products";
import { zod } from "sveltekit-superforms/adapters";
import { invalidFormMessage } from "$lib/utils";
import {
    findCategories,
    findPricingGroups,
    findTypes,
    insertProduct
} from "$lib/database/products";

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
        if (!form.valid) return message(form, invalidFormMessage);

        const created = await insertProduct(form.data);
        if (!created)
            return message(form, {
                type: "error",
                text: "Algo deu errado ao cadastrar o produto. Tente novamente mais tarde."
            });

        return message(form, {
            type: "success",
            text: "Produto cadastrado."
        });
    },
    newCategory: async (req) => {
        const form = await superValidate(req, zod(newCategorySchema));
        if (!form.valid) return message(form, invalidFormMessage);
    },
    newType: async (req) => {
        const form = await superValidate(req, zod(newTypeSchema));
        if (!form.valid) return message(form, invalidFormMessage);
    },
    newPricingGroup: async (req) => {
        const form = await superValidate(req, zod(newProductSchema));
        if (!form.valid) return message(form, invalidFormMessage);
    }
};
