import { relations } from "drizzle-orm";
import { profiles } from "./index";
import {
    pgTable,
    smallint,
    char,
    varchar,
    uuid,
    serial,
    integer,
    pgEnum
} from "drizzle-orm/pg-core";

export const residenceEnum = pgEnum("residence", ["casa", "apartamento"]);

export const addresses = pgTable("addresses", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    user: uuid("user")
        .references(() => profiles.id)
        .notNull(),
    country: integer("country")
        .references(() => countries.id)
        .notNull(),
    state: integer("state")
        .references(() => states.id)
        .notNull(),
    city: varchar("city", { length: 40 }).notNull(),
    zip_code: char("zip_code", { length: 8 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 50 }).notNull(),
    residence_type: residenceEnum("residence_type").notNull(),
    street: varchar("street", { length: 50 }).notNull(),
    number: smallint("number").notNull(),
    observations: varchar("observations", { length: 400 }).notNull()
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export const addressesRelations = relations(addresses, ({ one }) => ({
    country: one(countries, {
        fields: [addresses.country],
        references: [countries.id]
    }),
    state: one(states, {
        fields: [addresses.state],
        references: [states.id]
    })
}));

export const countries = pgTable("countries", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 56 }).notNull().unique()
});

export type Country = typeof countries.$inferSelect;

export const states = pgTable("states", {
    id: serial("id").primaryKey(),
    name: char("name", { length: 2 }).notNull().unique()
});

export type State = typeof states.$inferSelect;
