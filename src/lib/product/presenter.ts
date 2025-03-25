import { calculateProductPrice } from "$lib/utils";
import {
    Status,
    type SelectCategory,
    type SelectPricingGroup,
    type SelectProduct,
    type SelectType
} from "$lib/models";

export type Category = SelectCategory;
export type Type = SelectType;
export type PricingGroup = SelectPricingGroup;

export type Product = {
    id: number;
    name: string;
    desc: string;
    number: number;
    status: Status;
    barCode: string;
    price: number;
    weight: number;
    height: number;
    width: number;
    categories: string;
    type: string;
};

export function presentProduct(
    product: Omit<SelectProduct, "category" | "type" | "pricing_group"> & {
        category: SelectCategory;
        type: SelectType;
        pricing_group: SelectPricingGroup;
    }
): Product {
    return {
        id: product.id,
        name: product.name,
        desc: product.description,
        number: product.number,
        status: product.status,
        barCode: product.bar_code,
        price: calculateProductPrice(
            Number(product.cost),
            product.pricing_group.profit_margin
        ),
        weight: product.weight,
        height: product.height,
        width: product.width,
        categories: product.category.name,
        type: product.type.name
    };
}
