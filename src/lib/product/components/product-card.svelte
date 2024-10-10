<script lang="ts">
    import type { Category, PricingGroup, Type } from "$lib/database/schema";
    import { calculateProductPrice } from "$lib/utils";
    import { ShoppingCart } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";

    type Product = {
        number: number;
        type: Type;
        description: string;
        name: string;
        status: "ativo" | "inativo" | null;
        category: Category;
        id: number;
        year: number;
        bar_code: string;
        cost: string;
        weight: number;
        height: number;
        width: number;
        pricing_group: PricingGroup;
    };

    export let product: Product;
</script>

<div class="flex flex-col gap-4 rounded w-52">
    <p class="font-semibold">{product.name}</p>
    <p class="opacity-70 text-sm">{product.category.name}</p>
    <div class="flex justify-between items-center">
        <p class="font-semibold">
            {calculateProductPrice(
                Number(product.cost),
                product.pricing_group.profit_margin
            ).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}
        </p>
        <Button class="rounded-full" size="icon">
            <ShoppingCart size="16" />
        </Button>
    </div>
</div>
