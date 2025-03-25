import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { err, success, errInvalid, errGeneric } from "$lib/error";
import {
    newCategorySchema,
    newPricingGroupSchema,
    newProductSchema,
    newTypeSchema
} from "$lib/product/schema";
import {
    findCategories,
    findPricingGroups,
    findTypes,
    insertCategory,
    insertPricingGroup,
    insertProduct,
    insertType,
    uploadProductImages
} from "$lib/product/store";

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
    newProduct: async ({ request }) => {
        const form = await superValidate(request, zod(newProductSchema));
        if (!form.valid) return err(form, errInvalid);

        const created = await insertProduct(form.data);
        if (!created) return err(form, errGeneric);

        await uploadProductImages(created.id, form.data.images);
        return success(form, "Produto cadastrado.");
    },
    newCategory: async (req) => {
        const form = await superValidate(req, zod(newCategorySchema));
        if (!form.valid) return err(form, errInvalid);

        const created = await insertCategory(form.data);
        if (!created) return err(form, errGeneric);

        return success(form, "Categoria cadastrada");
    },
    newType: async (req) => {
        const form = await superValidate(req, zod(newTypeSchema));
        if (!form.valid) return err(form, errInvalid);

        const created = await insertType(form.data);
        if (!created) return err(form, errGeneric);

        return success(form, "Tipo cadastrado");
    },
    newPricingGroup: async (req) => {
        const form = await superValidate(req, zod(newPricingGroupSchema));
        if (!form.valid) return err(form, errInvalid);

        const created = await insertPricingGroup(form.data);

        if (!created) return err(form, errGeneric);

        return success(form, "Grupo de precificação cadastrado");
    }
};
