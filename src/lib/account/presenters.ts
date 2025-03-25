import type { Gender, SelectProfile } from "$lib/models";

export type Profile = {
    name: string;
    email: string;
    cpf: string | undefined;
    phone: string | undefined;
    gender: Gender | undefined;
    birth: Date | undefined;
};

export function presentProfile(profile: SelectProfile): Profile {
    return {
        name: profile.name!,
        email: profile.email!,
        cpf: profile.cpf || undefined,
        phone: profile.phone || undefined,
        gender: profile.gender || undefined,
        birth: profile.birth ? new Date(profile.birth) : undefined
    };
}
