import { profiles } from "./";
import { pgTable, varchar, uuid, serial, pgEnum } from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../utils";

export enum CardFlag {
    MasterCard = "mastercard",
    Visa = "visa"
}

export const flagEnum = pgEnum("card_flag", enumToPgEnum(CardFlag));

export type SelectCard = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;
export const cards = pgTable("cards", {
    id: serial("id").primaryKey(),
    alias: varchar("alias", { length: 50 }).notNull(),
    number: varchar("number", { length: 19 }).notNull(),
    holder: varchar("holder", { length: 255 }).notNull(),
    cvv: varchar("cvv", { length: 4 }).notNull(),
    flag: flagEnum("flag").notNull(),
    user: uuid("user")
        .references(() => profiles.id)
        .notNull()
});
