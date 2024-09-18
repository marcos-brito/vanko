import {
    date,
    integer,
    pgTable,
    serial,
    smallint,
    text,
    varchar
} from "drizzle-orm/pg-core";
import { statusEnum } from "./users";

export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description").notNull(),
    number: integer("number").notNull(),
    status: statusEnum("status").default("ativo"),
    year: date("year").notNull(),
    bar_code: integer("bar_code").notNull(),
    cost: integer("cost").notNull(),
    weight: smallint("weight").notNull(),
    height: smallint("height").notNull(),
    width: smallint("width").notNull(),
    pricing_group: integer("pricing_group")
        .references(() => pricingGroups.id)
        .notNull(),
    category: integer("category")
        .references(() => categories.id)
        .notNull(),
    type: integer("type")
        .references(() => types.id)
        .notNull()
});

export const pricingGroups = pgTable("pricing_groups", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    profit_margin: smallint("profit_margin").notNull()
});

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});

export const types = pgTable("types", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});
