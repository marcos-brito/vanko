DO $$ BEGIN
 CREATE TYPE "public"."card_flag" AS ENUM('mastercard', 'visa');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"alias" varchar(50) NOT NULL,
	"number" varchar(19) NOT NULL,
	"holder" varchar(255) NOT NULL,
	"cvv" varchar(4) NOT NULL,
	"flag" "card_flag" NOT NULL,
	"user" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cards" ADD CONSTRAINT "cards_user_profiles_id_fk" FOREIGN KEY ("user") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
