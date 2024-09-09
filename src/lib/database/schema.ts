import {
    pgTable,
    smallint,
    char,
    varchar,
    uuid,
    pgEnum,
    date,
    boolean,
    serial,
    integer
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["masculino", "feminino", "outro"]);
export const statusEnum = pgEnum("status", ["ativo", "inativo"]);
export const residenceEnum = pgEnum("residence", ["casa", "apartamento"]);

export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    cpf: char("cpf", { length: 11 }),
    phone: char("phone", { length: 11 }),
    gender: genderEnum("gender"),
    birth: date("birth"),
    is_admin: boolean("is_admin").default(false),
    status: statusEnum("status"),
    ranking: smallint("ranking").default(1)
});

export type Profile = typeof profiles.$inferSelect;
