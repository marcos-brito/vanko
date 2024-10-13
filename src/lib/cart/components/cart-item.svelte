<script lang="ts">
    import type { Product } from "$lib/shared/types";
    import { calculateProductPrice } from "$lib/utils";
    import CartItemActions from "./cart-item-actions.svelte";

    export let product: Product;
    export let quantity: number;

    const price = calculateProductPrice(
        Number(product.cost),
        product.profit_margin
    );
</script>

<article class="flex gap-4 items-center">
    <img class="bg-gray-50 size-16" alt={`${product.name} image`} />
    <div class="flex flex-col justify-between">
        <p class="font-bold">{product.name}</p>
        <p class="text-sm opacity-70">
            {price.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL"
            })}
        </p>
        <div class="flex gap-2 items-center justify-self-end">
            <CartItemActions {quantity} {product} />
        </div>
    </div>
</article>
