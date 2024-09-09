<script lang="ts">
    import SideBar from "$lib/components/side-bar.svelte";
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

<section class="flex flex-col md:flex-row">
    <SideBar {routes} />
    <slot />
</section>
