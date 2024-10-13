import type { Cart } from "$lib/cart/types";
import { type Writable } from "svelte/store";

export interface CartStore extends Writable<Cart> {
    addOne(productId: string): void;
    removeOne(productId: string): void;
    removeAll(productId: string): void;
}

export type Product = {
    number: number;
    type: string;
    description: string;
    name: string;
    status: "ativo" | "inativo" | null;
    category: string;
    id: number;
    year: number;
    bar_code: string;
    cost: string;
    weight: number;
    height: number;
    width: number;
    profit_margin: number;
};
