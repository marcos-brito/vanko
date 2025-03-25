<script lang="ts">
    import type { PageData } from "./$types";

    let {
        data
    }: {
        data: PageData;
    } = $props();
</script>

<main class="flex gap-4 flex-col">
    <div class="flex gap-3 mb-12">
        <h1>Produtos</h1>
        <p class="opacity-70 self-start">{data.products.length}</p>
    </div>
</main>
