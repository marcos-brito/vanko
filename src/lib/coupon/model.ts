import { redis } from "$lib/db";
import { type Coupon } from "./types";

export async function createUserCupom(
    userId: string,
    coupon: Coupon
): Promise<void> {
    const coupons = await findUserCoupons(userId);
    coupons.push(coupon);
    await redis.set(`user-coupons:${userId}`, JSON.stringify(coupons));
}

export async function findUserCoupons(userId: string): Promise<Array<Coupon>> {
    const coupons = await redis.get(`user-coupons:${userId}`);
    if (!coupons) return [];
    return JSON.parse(coupons);
}

export async function createGlobalCupom(coupon: Coupon): Promise<void> {
    const coupons = await findGlobalCoupons();
    coupons.push(coupon);
    await redis.set(`coupons`, JSON.stringify(coupons));
}

export async function findGlobalCoupons(): Promise<Array<Coupon>> {
    const coupons = await redis.get(`coupons`);
    if (!coupons) return [];
    return JSON.parse(coupons);
}
