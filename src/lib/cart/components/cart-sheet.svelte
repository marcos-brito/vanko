<script lang="ts">
    import { ShoppingCartIcon } from "lucide-svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    import Cart from "./cart.svelte";
    import type { Product, CartStore } from "$lib/shared/types";
    import { calculateProductPrice } from "$lib/utils";
    import { getContext } from "svelte";
    import { Button } from "$lib/components/ui/button/index.js";

    import { Separator } from "$lib/components/ui/separator";

    interface Props {
        products?: Array<Product>;
    }

    let { products = $bindable([]) }: Props = $props();
    const cart: CartStore = getContext("cart");

    let subTotal = $derived(products
        .map(
            (p) =>
                calculateProductPrice(Number(p.cost), p.profit_margin) *
                $cart[p.id]
        )
        .reduce((acc, p) => acc + p, 0));
</script>

<Sheet.Root>
    <Sheet.Trigger><ShoppingCartIcon /></Sheet.Trigger>
    <Sheet.Content class="flex flex-col gap-4">
        <Sheet.Header>
            <Sheet.Title>Carrinho</Sheet.Title>
            <Sheet.Description>
                Os items adicionados no carrinho vão aparecer aqui.
            </Sheet.Description>
        </Sheet.Header>
        <Cart class="overflow-auto" bind:products />
        <Separator />
        <div class="flex justify-between items-center">
            <p class="opacity-70">Total</p>
            <p>
                {subTotal.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL"
                })}
            </p>
        </div>
        {#if products.length == 0}
            <Button disabled>Finalizar pedido</Button>
        {:else}
            <Button href="/checkout">Finalizar pedido</Button>
        {/if}
    </Sheet.Content>
</Sheet.Root>
