-- Custom SQL migration file, put you code below! -
ALTER TABLE "addresses" ALTER COLUMN "zip_code" SET DATA TYPE char(8);--> statement-breakpoint
