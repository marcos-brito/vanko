<script lang="ts">
    import type { CartStore, Product } from "$lib/shared/types";
    import { getContext, onMount } from "svelte";
    import CartItem from "./cart-item.svelte";

    const cart: CartStore = getContext("cart");
    export let products: Array<Product & { images: Array<string> }> = [];
    $: productsIds = Object.keys($cart);

    cart.subscribe((cart) => {
        products = products.filter((p) => Object.hasOwn(cart, p.id));
    });

    async function fetchProduct(
        id: string
    ): Promise<(Product & { images: Array<string> }) | null> {
        const res = await fetch(`/api/products/${id}`);
        if (res.status == 400 || res.status == 404) {
            cart.removeAll(id);
            return null;
        }

        return await res.json();
    }

    onMount(async () => {
        if (productsIds.length > 0) {
            const fetchedProducts = await Promise.all(
                productsIds.map((id) => fetchProduct(id))
            );
            products = fetchedProducts.filter((p) => p != null);
        }
    });
</script>

<section {...$$props}>
    {#if products.length == 0}
        <p>Não há nenhum item no carrinho</p>
    {/if}
    {#each products as product}
        <CartItem {product} quantity={$cart[product.id]} />
    {/each}
</section>
