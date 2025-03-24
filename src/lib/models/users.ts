import { relations } from "drizzle-orm";
import { addresses } from "./index";
import {
    pgTable,
    smallint,
    char,
    varchar,
    uuid,
    pgEnum,
    date,
    boolean
} from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../utils";

export enum Gender {
    Male = "masculino",
    Female = "feminino",
    Other = "outro"
}

export enum Status {
    Active = "ativo",
    Inactive = "inativo"
}

export const genderEnum = pgEnum("gender", enumToPgEnum(Gender));
export const statusEnum = pgEnum("status", enumToPgEnum(Status));

export type SelectProfile = typeof profiles.$inferSelect;
export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 150 }),
    email: varchar("email", { length: 254 }),
    cpf: char("cpf", { length: 11 }),
    phone: char("phone", { length: 11 }),
    gender: genderEnum("gender"),
    birth: date("birth"),
    is_admin: boolean("is_admin").default(false),
    status: statusEnum("status").default(Status.Active),
    ranking: smallint("ranking").default(1)
});

export const usersRelations = relations(profiles, ({ many }) => ({
    addresses: many(addresses)
}));
