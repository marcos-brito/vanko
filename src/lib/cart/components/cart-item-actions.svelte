<script lang="ts">
    import { MinusIcon, PlusIcon } from "lucide-svelte";
    import { getContext } from "svelte";
    import { Button } from "$lib/components/ui/button";
    import type { CartStore, Product } from "$lib/shared/types";

    const cart: CartStore = getContext("cart");
    interface Props {
        product: Product;
        quantity: number;
    }

    let { product, quantity }: Props = $props();
</script>

<Button
    variant="ghost"
    size="icon"
    on:click={() => cart.removeOne(product.id.toString())}
>
    <MinusIcon size="14" />
</Button>
<p>{quantity}</p>
<Button
    variant="ghost"
    size="icon"
    on:click={() => cart.addOne(product.id.toString())}
>
    <PlusIcon size="14" />
</Button>
<Button
    class="font-bold text-sm"
    variant="link"
    on:click={() => cart.removeAll(product.id.toString())}
>
    Excluir
</Button>
