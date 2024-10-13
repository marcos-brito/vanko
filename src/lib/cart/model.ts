import { redis } from "$lib/db";
import { type Cart } from "./types";

export async function storeCart(userId: string, cart: Cart): Promise<void> {
    const cartStr = JSON.stringify(cart);
    await redis.set(`user-cart:${userId}`, cartStr);
}

export async function loadCart(userId: string): Promise<Cart | undefined> {
    const cart = await redis.get(`user-cart:${userId}`);
    if (!cart) return undefined;

    return JSON.parse(cart);
}
