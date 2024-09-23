<script lang="ts" context="module">
    import type { ComponentType } from "svelte";
    import { Button } from "$lib/components/ui/button";

    export type Route = {
        alias: string;
        icon: ComponentType;
        target: string;
    };
</script>

<script lang="ts">
    export let routes: Array<Route>;
</script>

<aside class="flex flex-col gap-2 items-start justify-center">
    {#each routes as route}
        <Button variant="link" href={route.target} class="flex gap-2">
            <svelte:component this={route.icon} size="16" />
            <p class="text-sm">{route.alias}</p>
        </Button>
    {/each}
</aside>
