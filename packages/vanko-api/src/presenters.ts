import { Gender, Role, Status, SelectUser } from "@/models/types/user.ts";

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
