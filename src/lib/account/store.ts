import { db } from "$lib/db";
import { profiles, type SelectProfile } from "$lib/models";
import { eq, count } from "drizzle-orm";

export async function findUserProfile(
    uuid: string
): Promise<SelectProfile | undefined> {
    return await db.query.profiles.findFirst({
        where: eq(profiles.id, uuid)
    });
}

export async function profileIsMissingInfo(uuid: string): Promise<boolean> {
    const fields: Array<keyof SelectProfile> = ["name", "email", "cpf", "phone", "gender", "birth"];

    return await findUserProfile(uuid).then((profile) => {
        return fields.some((field) => profile && (profile[field] == undefined || profile[field] == null))
    })
}

export async function findProfiles(): Promise<Array<SelectProfile>> {
    return await db.query.profiles.findMany();
}

export async function countProfiles(): Promise<number | undefined> {
    return await db.select({ count: count() }).from(profiles).then((result) => result.at(0)?.count);
}
