<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import type { Snippet } from "svelte";
    import {
        UserIcon,
        MapPinIcon,
        BoxIcon,
        CreditCardIcon
    } from "@lucide/svelte";

    let {
        children
    }: {
        children?: Snippet;
    } = $props();

    const items = [
        {
            target: "/account",
            alias: "Conta",
            icon: UserIcon
        },
        {
            target: "/orders",
            alias: "Pedidos",
            icon: BoxIcon
        },
        {
            target: "/addresses",
            alias: "Endereços",
            icon: MapPinIcon
        },
        {
            target: "/cards",
            alias: "Cartões",
            icon: CreditCardIcon
        }
    ];
</script>

<section class="flex flex-col gap-12 md:flex-row">
    <aside class="flex flex-col items-start">
        {#each items as route}
            <Button variant="ghost">
                <route.icon />
                <a href={route.target}> {route.alias}</a>
            </Button>
        {/each}
    </aside>
    {@render children?.()}
</section>
