<script lang="ts">
    import { toLocale } from "$lib/utils";
    import { ShoppingCart } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { AspectRatio } from "$lib/components/ui/aspect-ratio";
    import type { Product } from "../presenter";

    let {
        product,
        images
    }: {
        product: Product;
        images: Array<string>;
    } = $props();
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
    <p class="opacity-70 text-sm">{product.categories}</p>
    <div class="flex justify-between items-center">
        <p class="font-semibold">
            {toLocale(product.price)}
        </p>
        <Button class="rounded-full" size="icon">
            <ShoppingCart size="16" />
        </Button>
    </div>
</article>
