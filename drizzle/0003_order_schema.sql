DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('Em aberto', 'Aguardando pagamento', 'Pagamento aceito', 'Pagamento negado', 'Finalizado', 'Cancelado', 'Em tranporte', 'Entregue', 'Troca solicitada', 'Em troca', 'Troca recebida', 'Troca finalizada');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"country" integer NOT NULL,
	"state" integer NOT NULL,
	"city" varchar(40) NOT NULL,
	"zip_code" char(11) NOT NULL,
	"neighborhood" varchar(50) NOT NULL,
	"street" varchar(50) NOT NULL,
	"number" smallint NOT NULL,
	"residence_type" "residence" NOT NULL,
	"observations" varchar(400) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"product" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"subtotal" numeric(5, 2) NOT NULL,
	"deliver_cost" numeric(5, 2) NOT NULL,
	"discount" numeric(5, 2) NOT NULL,
	"total" numeric(5, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"status" "order_status" NOT NULL,
	"user" uuid NOT NULL,
	"address" integer NOT NULL,
	"products" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_address" ADD CONSTRAINT "order_address_country_countries_id_fk" FOREIGN KEY ("country") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_address" ADD CONSTRAINT "order_address_state_states_id_fk" FOREIGN KEY ("state") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_products_id_fk" FOREIGN KEY ("product") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_profiles_id_fk" FOREIGN KEY ("user") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_address_order_address_id_fk" FOREIGN KEY ("address") REFERENCES "public"."order_address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_products_order_products_id_fk" FOREIGN KEY ("products") REFERENCES "public"."order_products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
