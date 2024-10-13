import { writable } from "svelte/store";
import { type Cart } from "./types";
import type { CartStore } from "$lib/shared/types";
import { browser } from "$app/environment";

export function createCartStore(): CartStore {
    const { subscribe, update, set } = writable<Cart>({});

    function addOne(productId: string): void {
        update((cart) => {
            if (!Object.hasOwn(cart, productId)) cart[productId] = 0;
            cart[productId] += 1;
            return cart;
        });
    }

    function removeOne(productId: string): void {
        update((cart) => {
            if (!Object.hasOwn(cart, productId)) return cart;
            if (cart[productId] > 1) cart[productId] -= 1;
            return cart;
        });
    }

    function removeAll(productId: string): void {
        update((cart) => {
            delete cart[productId];
            return cart;
        });
    }

    return {
        set,
        update,
        subscribe,
        addOne,
        removeOne,
        removeAll
    };
}

export function saveOnServer(cart: CartStore): void {
    cart.subscribe(async (cart) => {
        await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify(cart),
            headers: {
                "content-type": "application/json"
            }
        });
    });
}

export function saveOnLocalStorage(cart: CartStore): void {
    cart.subscribe((cart) => {
        window.localStorage.setItem("cart", JSON.stringify(cart));
    });
}

export function readFromLocalStorege() {
    if (!browser) return {};
    const cart = window.localStorage.getItem("cart") || "{}";
    return JSON.parse(cart);
}
