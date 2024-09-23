<script lang="ts">
    import {
        Users,
        Tags,
        LayoutDashboard,
        LogOut,
        Settings,
        User,
        Bell,
        Package
    } from "lucide-svelte";
    import Menu from "$lib/components/menu.svelte";
    import { Button } from "./ui/button";

    let generalRoutes = [
        { alias: "Dashboard", target: "/dashboard", icon: LayoutDashboard },
        { alias: "Orders", target: "/dashboard/orders", icon: Package },
        {
            alias: "Customers",
            target: "/dashboard/customers",
            icon: Users
        },
        { alias: "Products", target: "/dashboard/products", icon: Tags }
    ];

    let youRoutes = [
        {
            alias: "Notifications",
            target: "/dashboard/notifications",
            icon: Bell
        },
        { alias: "Account", target: "/dashboard/account", icon: User },
        { alias: "Settings", target: "/dashboard/settings", icon: Settings }
    ];
</script>

<aside class="flex gap-4 flex-col">
    <p class="font-semibold text-xs">Geral</p>
    <Menu routes={generalRoutes} />
    <p class="font-semibold text-xs">Você</p>
    <Menu routes={youRoutes} />
    <Button class="self-start flex gap-2 text-sm" variant="link">
        <LogOut size="16" />
        Sair
    </Button>
</aside>
