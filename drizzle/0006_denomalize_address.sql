ALTER TYPE "status_change_kind" ADD VALUE 'activation';--> statement-breakpoint
ALTER TYPE "status_change_kind" ADD VALUE 'deactivation';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'em aberto';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'aguardando pagamento';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'pagamento aceito';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'pagamento negado';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'finalizado';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'cancelado';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'em tranporte';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'entregue';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'troca solicitada';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'em troca';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'troca recebida';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'troca finalizada';--> statement-breakpoint
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_country_countries_id_fk";
--> statement-breakpoint
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_state_states_id_fk";
--> statement-breakpoint
ALTER TABLE "order_address" DROP CONSTRAINT "order_address_country_countries_id_fk";
--> statement-breakpoint
ALTER TABLE "order_address" DROP CONSTRAINT "order_address_state_states_id_fk";
--> statement-breakpoint
DROP TABLE "countries";--> statement-breakpoint
DROP TABLE "states";--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "state" SET DATA TYPE char(2);--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "status" SET DEFAULT 'ativo';--> statement-breakpoint
ALTER TABLE "order_address" ALTER COLUMN "state" SET DATA TYPE char(2);--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN IF EXISTS "country";--> statement-breakpoint
ALTER TABLE "order_address" DROP COLUMN IF EXISTS "country";
