import { Generated, Selectable } from "kysely";

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
    role: Role;
    name: string;
    gender: Gender;
    cpf: string;
    phone: string;
    ranking: number;
    status: Status;
}

export type User = Selectable<UserTable>;
