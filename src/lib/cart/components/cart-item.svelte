<script lang="ts">
    import type { Product } from "$lib/shared/types";
    import { calculateProductPrice } from "$lib/utils";
    import CartItemActions from "./cart-item-actions.svelte";

    interface Props {
        product: Product & { images: Array<string> };
        quantity: number;
    }

    let { product, quantity }: Props = $props();

    const price = calculateProductPrice(
        Number(product.cost),
        product.profit_margin
    );
</script>

<article class="flex gap-4 items-center">
    <img
        src={product.images[0]}
        class="aspect-square size-20"
        alt={`${product.name} image`}
    />
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
