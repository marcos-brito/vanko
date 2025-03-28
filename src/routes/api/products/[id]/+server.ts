import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { findProduct, findProductImages } from "$lib/product/store";

export const GET: RequestHandler = async ({ params }) => {
    const id = Number(params.id);
    if (!id) return json("Bad id", { status: 400 });

    const product = await findProduct(id);
    if (!product) return json("Product not found", { status: 404 });

    return json(
        { ...product, images: await findProductImages(product.id) },
        { status: 200 }
    );
};
