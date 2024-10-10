import type { countries, states } from "$lib/schema";

export enum ResidenceType {
    HOUSE = "casa",
    APARTMENT = "apartamento"
}

export type Address = {
    id: number;
    number: number;
    name: string;
    country: string;
    state: string;
    city: string;
    zip_code: string;
    neighborhood: string;
    residence_type: ResidenceType;
    street: string;
    observations: string;
};

export type State = typeof states.$inferSelect;
export type Country = typeof countries.$inferSelect;
