<script lang="ts">
    import { run } from 'svelte/legacy';

    import { Button } from "$lib/components/ui/button";
    import { ColumnsIcon, PlusIcon } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Input } from "$lib/components/ui/input";
    import type { FlatColumn } from "svelte-headless-table";
    import type { Product } from "$lib/shared/types";

    interface Props {
        filterValue?: string;
        hiddenColumnsIds?: Array<String>;
        flatColumns: Array<FlatColumn<Product>>;
    }

    let { filterValue = $bindable(""), hiddenColumnsIds = $bindable([]), flatColumns }: Props = $props();

    const ids = flatColumns.map((col) => col.id);
    const hidableCols = [
        "status",
        "category",
        "type",
        "year",
        "number",
        "bar_code"
    ];
    let hideForId = $state(Object.fromEntries(ids.map((id) => [id, true])));

    run(() => {
        hiddenColumnsIds = Object.entries(hideForId)
            .filter(([, hide]) => !hide)
            .map(([id]) => id);
    });
</script>

<header class="flex items-center justify-between">
    <div class="flex items-center gap-8 w-full">
        <Input
            class="max-w-sm"
            placeholder="Procure um produto"
            type="text"
            bind:value={filterValue}
        />
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild >
                {#snippet children({ builder })}
                                <Button variant="ghost" builders={[builder]}>
                        <ColumnsIcon size="20" class="mr-3" />
                        Colunas
                    </Button>
                                            {/snippet}
                        </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each flatColumns as col}
                    {#if hidableCols.includes(col.id)}
                        <DropdownMenu.CheckboxItem
                            bind:checked={hideForId[col.id]}
                        >
                            {col.header}
                        </DropdownMenu.CheckboxItem>
                    {/if}
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
    <Button href="/dashboard/products/new">
        <PlusIcon class="mr-2 " />
        Adicionar produto
    </Button>
</header>
