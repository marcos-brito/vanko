import type { ResidenceKind, SelectAddress } from "$lib/models";

export type Address = {
    id: number;
    number: number;
    name: string;
    state: string;
    city: string;
    zip_code: string;
    neighborhood: string;
    residence_type: ResidenceKind;
    street: string;
    observations: string;
};

export function presentAddress(address: SelectAddress): Address {
    return {
        id: address.id,
        number: address.number,
        name: address.name,
        state: address.state,
        city: address.city,
        zip_code: address.zip_code,
        neighborhood: address.neighborhood,
        residence_type: address.residence_type,
        street: address.street,
        observations: address.observations
    };
}
