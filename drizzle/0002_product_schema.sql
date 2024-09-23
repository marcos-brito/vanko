CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pricing_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"profit_margin" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text NOT NULL,
	"number" smallint NOT NULL,
	"status" "status" DEFAULT 'ativo',
	"year" smallint NOT NULL,
	"bar_code" varchar(13) NOT NULL,
	"cost" numeric(5, 2) NOT NULL,
	"weight" real NOT NULL,
	"height" real NOT NULL,
	"width" real NOT NULL,
	"pricing_group" integer NOT NULL,
	"category" integer NOT NULL,
	"type" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_pricing_group_pricing_groups_id_fk" FOREIGN KEY ("pricing_group") REFERENCES "public"."pricing_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_type_types_id_fk" FOREIGN KEY ("type") REFERENCES "public"."types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
