<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import type { Product } from "$lib/shared/types";
    import ProductStatusForm from "./product-status-form.svelte";

    export let product: Product;
</script>

<Sheet.Root>
    <Sheet.Content>
        <Sheet.Header class="mb-4">
            <Sheet.Title>Alterar status</Sheet.Title>
        </Sheet.Header>
        <ProductStatusForm
            id={product.id}
            kind={product.status == "ativo" ? "deactivate" : "activate"}
        />
    </Sheet.Content>
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
            <Button
                variant="ghost"
                builders={[builder]}
                size="icon"
                class="relative h-8 w-8 p-0"
            >
                <span class="sr-only">Open menu</span>
                <Ellipsis class="h-4 w-4" />
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Group>
                <DropdownMenu.Item>
                    <Sheet.Trigger
                        >{product.status == "ativo"
                            ? "Desativar"
                            : "Ativar"}</Sheet.Trigger
                    >
                </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Item
                on:click={() => goto(`/dashboard/products/${product.id}`)}
                >Ver detalhes</DropdownMenu.Item
            >
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</Sheet.Root>
