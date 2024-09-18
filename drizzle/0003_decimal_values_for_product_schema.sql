ALTER TABLE "pricing_groups" ALTER COLUMN "profit_margin" SET DATA TYPE numeric(1, 2);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "cost" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "weight" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "height" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "width" SET DATA TYPE real;