<script lang="ts">
    import DashboardSidebar from "$lib/components/dashboard-sidebar.svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    import { MenuIcon } from "lucide-svelte";
</script>

<section class="p-8 gap-12 flex flex-col lg:flex-row">
    <div class="hidden lg:block h-screen top-0 sticky">
        <a href="/dashboard" class="flex flex-col mb-8">
            <h1 class="text-4xl">vanko</h1>
            <p class="opacity-70 text-xs ml-3">dashboard</p>
        </a>
        <DashboardSidebar />
    </div>
    <nav class="flex w-full justify-between lg:hidden">
        <h1 class="text-xl">vanko</h1>
        <Sheet.Root>
            <Sheet.Trigger class="lg:hidden">
                <MenuIcon />
            </Sheet.Trigger>
            <Sheet.Content side="right">
                <DashboardSidebar />
            </Sheet.Content>
        </Sheet.Root>
    </nav>
    <main class="w-full">
        <slot />
    </main>
</section>
