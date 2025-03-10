<script lang="ts">
    import { calculateProductPrice } from "$lib/utils";
    import { ShoppingCart } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { getContext } from "svelte";
    import { type CartStore, type Product } from "$lib/shared/types";
    import { AspectRatio } from "$lib/components/ui/aspect-ratio";

    interface Props {
        product: Product;
        images: Array<string>;
    }

    let { product, images }: Props = $props();

    const cart: CartStore = getContext("cart");
</script>

<article class="flex flex-col gap-4 rounded w-52">
    <a href={`products/${product.id}`}>
        <AspectRatio ratio={1 / 1}>
            <img src={images[0]} alt={product.name} class="rounded" />
        </AspectRatio>
    </a>
    <a href={`products/${product.id}`}>
        <h1 class="text-lg">{product.name}</h1>
    </a>
    <p class="opacity-70 text-sm">{product.category}</p>
    <div class="flex justify-between items-center">
        <p class="font-semibold">
            {calculateProductPrice(
                Number(product.cost),
                product.profit_margin
            ).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}
        </p>
        <Button
            class="rounded-full"
            on:click={() => cart.addOne(product.id.toString())}
            size="icon"
        >
            <ShoppingCart size="16" />
        </Button>
    </div>
</article>
