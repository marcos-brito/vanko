import { profiles } from "./users";
import { products } from "./products";
import { countries, residenceEnum, states } from "./addresses";
import { relations } from "drizzle-orm";
import {
    char,
    integer,
    numeric,
    pgEnum,
    pgTable,
    serial,
    smallint,
    uuid,
    varchar
} from "drizzle-orm/pg-core";
import { enumToPgEnum } from "$lib/utils";

export enum OrderStatus {
    Open = "em aberto",
    WaitingPayment = "aguardando pagamento",
    PaymentAccepted = "pagamento aceito",
    PaymentDeclined = "pagamento negado",
    Finished = "finalizado",
    Canceled = "cancelado",
    Transporting = "em tranporte",
    Delivered = "entregue",
    ExchangeRequested = "troca solicitada",
    ExchangeInProgress = "em troca",
    ExchangeReceived = "troca recebida",
    ExchangeFinished = "troca finalizada"
}

export const orderStatus = pgEnum("order_status", enumToPgEnum(OrderStatus));

export type SelectOrder = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    subtotal: numeric("subtotal", { precision: 5, scale: 2 }).notNull(),
    deliverCost: numeric("deliver_cost", { precision: 5, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 5, scale: 2 }).notNull(),
    total: numeric("total", { precision: 5, scale: 2 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    status: orderStatus("status").notNull(),
    user: uuid("user")
        .references(() => profiles.id)
        .notNull(),
    address: integer("address")
        .references(() => orderAddress.id)
        .notNull(),
    products: integer("products")
        .references(() => orderProducts.id)
        .notNull()
});


export type SelectOrderProduct = typeof orderProducts.$inferSelect;
export const orderProducts = pgTable("order_products", {
    id: serial("id").primaryKey(),
    cost: numeric("cost", { precision: 5, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    product: integer("product")
        .references(() => products.id)
        .notNull()
});

export type SelectOrderAddress = typeof orderAddress.$inferSelect;
export const orderAddress = pgTable("order_address", {
    id: serial("id").primaryKey(),
    country: integer("country")
        .references(() => countries.id)
        .notNull(),
    state: integer("state")
        .references(() => states.id)
        .notNull(),
    city: varchar("city", { length: 40 }).notNull(),
    zip_code: char("zip_code", { length: 8 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 50 }).notNull(),
    street: varchar("street", { length: 50 }).notNull(),
    number: smallint("number").notNull(),
    residence_type: residenceEnum("residence_type").notNull(),
    observations: varchar("observations", { length: 400 }).notNull()
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
    address: one(orderAddress, {
        fields: [orders.address],
        references: [orderAddress.id]
    }),
    products: many(orderProducts)
}));

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
    products: one(products, {
        fields: [orderProducts.product],
        references: [products.id]
    })
}));

export const orderAddressRelations = relations(orderAddress, ({ one }) => ({
    country: one(countries, {
        fields: [orderAddress.country],
        references: [countries.id]
    }),
    state: one(states, {
        fields: [orderAddress.state],
        references: [states.id]
    })
}));
