import {
    Generated,
    Selectable,
    Insertable,
    Updateable,
    ColumnType
} from "kysely";

export enum ResidenceType {
    Apartment = "apartamento",
    House = "casa"
}

export interface AddressTable {
    id: Generated<number>;
    user: number;
    country: ColumnType<string, number, number>;
    state: ColumnType<string, number, number>;
    city: ColumnType<string, number, number>;
    name: string;
    zip_code: string;
    neighborhood: string;
    street: string;
    number: number;
    residence_type: ResidenceType;
    observations: string | null;
}

export type SelectAddress = Selectable<AddressTable>;
export type InsertAddress = Insertable<AddressTable>;
export type UpdateAddress = Updateable<AddressTable>;

export interface CountryTable {
    id: Generated<number>;
    name: string;
}

export type SelectCountry = Selectable<CountryTable>;
export type InsertCountry = Insertable<CountryTable>;

export interface StateTable {
    id: Generated<number>;
    name: string;
}

export type SelectState = Selectable<StateTable>;
export type InsertState = Insertable<StateTable>;

export interface CityTable {
    id: Generated<number>;
    name: string;
}

export type SelectCity = Selectable<CityTable>;
export type InsertCity = Insertable<CityTable>;
