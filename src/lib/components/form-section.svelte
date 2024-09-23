<script lang="ts">
    export let name: string;
</script>

<div class="flex flex-col gap-3">
    <p class="text-xl">{name}</p>
    <slot />
</div>
