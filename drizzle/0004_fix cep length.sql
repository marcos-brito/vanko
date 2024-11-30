DROP TABLE "order_address";--> statement-breakpoint
DROP TABLE "order_products";--> statement-breakpoint
DROP TABLE "orders";--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "zip_code" SET DATA TYPE char(8);