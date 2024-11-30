import {
    ShippingMethod,
    type OrderDetails,
    type ShippingInfo,
    type ShippingProvider
} from "./types";

export function findProvider(shippingMethod: ShippingMethod): ShippingProvider {
    switch (shippingMethod) {
        case ShippingMethod.FAST_SHIPPING:
            return new FastShipping();
        case ShippingMethod.REGULAR_SHIPPING:
            return new RegularShipping();
    }
}

// Mocked for now
export class FastShipping implements ShippingProvider {
    getInfo(_details: OrderDetails): ShippingInfo {
        return {
            leadTime: 2,
            cost: 15.0
        };
    }
}

// Mocked for now
export class RegularShipping implements ShippingProvider {
    getInfo(_details: OrderDetails): ShippingInfo {
        return {
            leadTime: 4,
            cost: 8.45
        };
    }
}
