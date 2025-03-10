<script lang="ts">
    import Menu from "$lib/components/menu.svelte";
    import {
        UserIcon,
        MapPinIcon,
        BoxIcon,
        CreditCardIcon
    } from "lucide-svelte";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    const routes = [
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
    <div>
        <Menu {routes} />
    </div>
    {@render children?.()}
</section>
