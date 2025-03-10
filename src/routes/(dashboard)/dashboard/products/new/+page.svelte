<script lang="ts">
    import NewProductForm from "$lib/product/components/new-product-form.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<section>
    <h1 class="mb-12">Novo produto</h1>
    <NewProductForm {data} />
</section>
