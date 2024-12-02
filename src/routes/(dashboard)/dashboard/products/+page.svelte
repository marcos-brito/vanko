<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-svelte";
    import type { PageData } from "./$types";
    import { readable } from "svelte/store";
    import {
        addPagination,
        addSortBy,
        addTableFilter,
        addHiddenColumns
    } from "svelte-headless-table/plugins";
    import {
        createRender,
        createTable,
        Render,
        Subscribe
    } from "svelte-headless-table";
    import * as Table from "$lib/components/ui/table";
    import { calculateProductPrice, toLocale } from "$lib/utils";
    import ProductRowActions from "$lib/product/components/product-row-actions.svelte";
    import ProductTableActions from "$lib/product/components/product-table-actions.svelte";

    export let data: PageData;

    const table = createTable(readable(data.products), {
        page: addPagination(),
        sort: addSortBy(),
        hide: addHiddenColumns(),
        filter: addTableFilter({
            fn: ({ filterValue, value }) =>
                value.toLowerCase().includes(filterValue.toLowerCase())
        })
    });
    const columns = table.createColumns([
        table.column({ accessor: "name", header: "Nome" }),
        table.column({ accessor: "category", header: "Categoria" }),
        table.column({ accessor: "type", header: "Tipo" }),
        table.column({ accessor: "year", header: "Ano" }),
        table.column({
            accessor: "number",
            header: "Número"
        }),
        table.column({ accessor: "bar_code", header: "Código de barras" }),
        table.column({ accessor: "status", header: "Status" }),
        table.column({
            accessor: (product) => {
                return toLocale(
                    calculateProductPrice(
                        Number(product.cost),
                        product.profit_margin
                    )
                );
            },
            header: "Preço"
        }),
        table.column({
            accessor: (product) => product,
            header: "",
            cell: ({ value }) => {
                return createRender(ProductRowActions, {
                    product: value
                });
            }
        })
    ]);

    const {
        headerRows,
        pageRows,
        tableAttrs,
        tableBodyAttrs,
        pluginStates,
        flatColumns
    } = table.createViewModel(columns);

    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
    const { hiddenColumnIds } = pluginStates.hide;
</script>

<main class="flex gap-4 flex-col">
    <div class="flex gap-3 mb-12">
        <h1>Produtos</h1>
        <p class="opacity-70 self-start">{data.productsCount}</p>
    </div>

    <ProductTableActions
        {flatColumns}
        bind:filterValue={$filterValue}
        bind:hiddenColumnsIds={$hiddenColumnIds}
    />

    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe
                                attrs={cell.attrs()}
                                let:attrs
                                props={cell.props()}
                                let:props
                            >
                                <Table.Head {...attrs}>
                                    <button
                                        class="flex items-center gap-2 cursor-default"
                                        on:click={props.sort.toggle}
                                    >
                                        <Render of={cell.render()} />
                                        {#if props.sort.order == "asc"}
                                            <ChevronUpIcon size="16" />
                                        {/if}
                                        {#if props.sort.order == "desc"}
                                            <ChevronDownIcon size="16" />
                                        {/if}
                                    </button>
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
    <div class="flex items-center justify-end space-x-4 py-4">
        <Button
            variant="outline"
            size="sm"
            on:click={() => ($pageIndex = $pageIndex - 1)}
            disabled={!$hasPreviousPage}>Previous</Button
        >
        <Button
            variant="outline"
            size="sm"
            disabled={!$hasNextPage}
            on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
        >
    </div>
</main>
