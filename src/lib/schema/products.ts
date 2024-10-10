import {
    integer,
    numeric,
    pgTable,
    real,
    serial,
    smallint,
    text,
    varchar
} from "drizzle-orm/pg-core";
import { statusEnum } from "./users";
import { relations } from "drizzle-orm";

export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description").notNull(),
    number: smallint("number").notNull(),
    status: statusEnum("status").default("ativo"),
    year: smallint("year").notNull(),
    bar_code: varchar("bar_code", { length: 13 }).notNull(),
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

export const productsRelations = relations(products, ({ one }) => ({
    category: one(categories, {
        fields: [products.category],
        references: [categories.id]
    }),
    type: one(types, {
        fields: [products.type],
        references: [types.id]
    }),
    pricing_group: one(pricingGroups, {
        fields: [products.pricing_group],
        references: [pricingGroups.id]
    })
}));

export const pricingGroups = pgTable("pricing_groups", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    profit_margin: real("profit_margin").notNull()
});

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});

export const types = pgTable("types", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});
