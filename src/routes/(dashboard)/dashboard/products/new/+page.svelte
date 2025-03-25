<script lang="ts">
    import NewProductForm from "$lib/product/components/product-form.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<section>
    <h1 class="mb-12">Novo produto</h1>
    <NewProductForm
        data={data.form}
        categories={data.categories}
        types={data.types}
        pricingGroups={data.pricing_groups}
    />
</section>
