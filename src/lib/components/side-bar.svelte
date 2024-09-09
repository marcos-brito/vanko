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

<aside class="flex h-full flex-col gap-4 items-start min-w-48 justify-center">
    {#each routes as route}
        <Button variant="link" href={route.target}>
            <svelte:component this={route.icon} class="mr-3" />
            <p>{route.alias}</p>
        </Button>
    {/each}
</aside>
