<script lang="ts">
    import Menu from "$lib/components/menu.svelte";
    import { UserIcon, MapPinIcon, BoxIcon } from "lucide-svelte";

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
        }
    ];
</script>

<section class="flex flex-col gap-12 md:flex-row">
    <div>
        <Menu {routes} />
    </div>
    <slot />
</section>
