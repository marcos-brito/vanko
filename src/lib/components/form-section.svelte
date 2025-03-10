<script lang="ts">
    interface Props {
        name: string;
        children?: import('svelte').Snippet;
    }

    let { name, children }: Props = $props();
</script>

<div class="flex flex-col gap-3">
    <p class="text-xl">{name}</p>
    {@render children?.()}
</div>
