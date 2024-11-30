import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { newShippingInfo } from "$lib/shipping/schemas";
import { ShippingMethod, type ShippingInfo } from "$lib/shipping/types";
import { findProvider } from "$lib/shipping/providers";
import { ZodError } from "zod";

export const POST: RequestHandler = async ({
    request,
    locals: { safeGetSession }
}) => {
    try {
        const { user } = await safeGetSession();
        if (!user) return json({}, { status: 401 });

        const body = await request.json();
        const details = newShippingInfo.parse(body);
        const shippingInfo: Record<string, ShippingInfo> = {};

        for (const [_, v] of Object.entries(ShippingMethod)) {
            const provider = findProvider(v);
            shippingInfo[v] = provider.getInfo({
                ...details,
                destinationZipCode: "123"
            });
        }

        return json(shippingInfo, { status: 200 });
    } catch (e) {
        console.log(e);
        if (e instanceof ZodError) return json({}, { status: 400 });
        return json({}, { status: 500 });
    }
};
