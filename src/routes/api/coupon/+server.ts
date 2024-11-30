import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { validateCouponSchema } from "$lib/coupon/schema";
import { findGlobalCoupons, findUserCoupons } from "$lib/coupon/model";

export const POST: RequestHandler = async ({
    request,
    locals: { safeGetSession }
}) => {
    try {
        const { user } = await safeGetSession();
        if (!user) return json({}, { status: 401 });
        const body = await request.json();
        const couponName = validateCouponSchema.parse(body).name;
        const globalCoupons = await findGlobalCoupons();
        const userCoupons = await findUserCoupons(user.id);
        const found = globalCoupons
            .concat(...userCoupons)
            .find((coupon) => coupon.name == couponName);

        if (found) {
            return json(found, { status: 200 });
        }

        return json({}, { status: 200 });
    } catch {
        return json({}, { status: 500 });
    }
};
