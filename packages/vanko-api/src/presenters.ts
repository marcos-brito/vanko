import { Gender, Role, Status, SelectUser } from "@/models/types/user.ts";
import { SelectAddress } from "./models/types/address.ts";

export type User = {
    id: number;
    email: string;
    role: Role;
    name: string;
    gender: Gender;
    cpf: string;
    phone: string;
    ranking: number;
    status: Status;
    birth: string;
};

export function presentUser(user: SelectUser): User {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        gender: user.gender,
        cpf: user.cpf,
        phone: user.phone,
        ranking: user.ranking,
        status: user.status,
        birth: user.birth.toISOString()
    };
}

export type Address = {
    id: number;
    user: number;
    country: string;
    state: string;
    city: string;
    name: string;
    zip_code: string;
    neighborhood: string;
    street: string;
    number: number;
    residence_type: string;
    observations: string | null;
};

export function presentAddress(address: SelectAddress): Address {
    return {
        id: address.id,
        user: address.user,
        country: address.country,
        state: address.state,
        city: address.city,
        name: address.name,
        zip_code: address.zip_code,
        neighborhood: address.neighborhood,
        street: address.street,
        number: address.number,
        residence_type: address.residence_type,
        observations: address.observations
    };
}
