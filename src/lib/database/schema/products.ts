import {
    date,
    integer,
    numeric,
    pgTable,
    real,
    serial,
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
    cost: numeric("cost", { precision: 5, scale: 2 }).notNull(),
    weight: real("weight").notNull(),
    height: real("height").notNull(),
    width: real("width").notNull(),
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
    profit_margin: numeric("profit_margin", {
        precision: 1,
        scale: 2
    }).notNull()
});

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});

export const types = pgTable("types", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});
