<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Pagination from "$lib/components/ui/pagination";
    import {
        ChevronDownIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        ChevronUpIcon,
        PlusIcon
    } from "lucide-svelte";
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

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

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

    const { hasNextPage, hasPreviousPage, pageIndex, pageCount, pageSize } =
        pluginStates.page;
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
                                
                                props={cell.props()}
                                
                            >
                                {#snippet children({ attrs, props })}
                                                                <Table.Head {...attrs}>
                                        <button
                                            class="flex items-center gap-2 cursor-default"
                                            onclick={props.sort.toggle}
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
                                                                                            {/snippet}
                                                        </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} >
                    {#snippet children({ rowAttrs })}
                                        <Table.Row {...rowAttrs}>
                            {#each row.cells as cell (cell.id)}
                                <Subscribe attrs={cell.attrs()} >
                                    {#snippet children({ attrs })}
                                                                <Table.Cell {...attrs}>
                                            <Render of={cell.render()} />
                                        </Table.Cell>
                                                                                                {/snippet}
                                                        </Subscribe>
                            {/each}
                        </Table.Row>
                                                        {/snippet}
                                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
    <Pagination.Root
        count={$pageCount}
        perPage={$pageSize}
        
        
    >
        {#snippet children({ pages, currentPage })}
                <Pagination.Content>
                <Pagination.Item>
                    <Pagination.PrevButton>
                        <ChevronLeftIcon size="16" />
                    </Pagination.PrevButton>
                </Pagination.Item>
                {#each pages as page (page.key)}
                    {#if page.type === "ellipsis"}
                        <Pagination.Item>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                    {:else}
                        <Pagination.Item>
                            <Pagination.Link
                                {page}
                                on:click={() => ($pageIndex = page.value - 1)}
                                isActive={currentPage == page.value}
                            >
                                {page.value}
                            </Pagination.Link>
                        </Pagination.Item>
                    {/if}
                {/each}
                <Pagination.Item>
                    <Pagination.NextButton>
                        <ChevronRightIcon size="16" />
                    </Pagination.NextButton>
                </Pagination.Item>
            </Pagination.Content>
                    {/snippet}
        </Pagination.Root>
</main>
