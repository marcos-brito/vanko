import { Generated, Selectable, Insertable, ColumnType } from "kysely";

/**
 * A shortcut to defining columns with default values. The type is
 * the same for selects, inserted and updates, but can be omitted for insertions.
 */
type Defaulted<T> = ColumnType<T, T | undefined, T>;

export enum Role {
    User = "user",
    Admin = "admin"
}

export enum Status {
    Active = "active",
    Inactive = "inactive"
}

export enum Gender {
    Male = "male",
    Female = "female",
    Unspecified = "unspecified"
}

export interface UserTable {
    id: Generated<number>;
    email: string;
    hashed_password: string;
    role: Defaulted<Role>;
    name: string;
    gender: Defaulted<Gender>;
    cpf: string;
    phone: string;
    ranking: Defaulted<number>;
    status: Defaulted<Status>;
}

export type SelectUser = Selectable<UserTable>;
export type InsertUser = Insertable<UserTable>;
