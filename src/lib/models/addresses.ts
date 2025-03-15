import { profiles } from "./";
import {
    pgTable,
    smallint,
    char,
    varchar,
    uuid,
    serial,
    pgEnum
} from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../utils";

export enum ResidenceKind {
    House = "casa",
    Apartment = "apartamento"
}

export const residenceEnum = pgEnum("residence", enumToPgEnum(ResidenceKind));

export type SelectAddress = typeof addresses.$inferSelect;
export type InsertAdress = typeof addresses.$inferInsert;
export const addresses = pgTable("addresses", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    user: uuid("user")
        .references(() => profiles.id)
        .notNull(),
    state: char("state", { length: 2 }).notNull(),
    city: varchar("city", { length: 40 }).notNull(),
    zip_code: char("zip_code", { length: 8 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 50 }).notNull(),
    residence_type: residenceEnum("residence_type").notNull(),
    street: varchar("street", { length: 50 }).notNull(),
    number: smallint("number").notNull(),
    observations: varchar("observations", { length: 400 }).notNull()
});
