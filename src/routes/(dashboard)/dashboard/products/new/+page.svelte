<script lang="ts">
    import NewProductForm from "$lib/components/new-product-form.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<section>
    <h1>Novo produto</h1>
    <NewProductForm {data} />
</section>
