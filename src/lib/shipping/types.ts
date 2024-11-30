export enum ShippingMethod {
    FAST_SHIPPING = "Entrega expressa",
    REGULAR_SHIPPING = "Entrega normal"
}

export type ShippingInfo = {
    leadTime: number;
    cost: number;
};

export type OrderDetails = {
    sourceZipCode: string;
    destinationZipCode: string;
    weight: number;
};

export interface ShippingProvider {
    //TODO: Better name
    getInfo(details: OrderDetails): ShippingInfo;
}
