DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('masculino', 'feminino', 'outro');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('ativo', 'inativo');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(150),
	"email" varchar(254),
	"cpf" char(11),
	"phone" char(11),
	"gender" "gender",
	"birth" date,
	"is_admin" boolean DEFAULT false,
	"status" "status",
	"ranking" smallint DEFAULT 1
);
