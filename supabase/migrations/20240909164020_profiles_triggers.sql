CREATE FUNCTION "public"."handle_new_user" () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET
    search_path = '' AS $$
BEGIN
  INSERT INTO "public"."profiles" (
    "id",
    "name"
  )
  VALUES (
    NEW."id",
    NEW."raw_user_meta_data" ->> 'name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER "on_auth_user_created"
AFTER INSERT ON "auth"."users" FOR EACH ROW
EXECUTE PROCEDURE "public"."handle_new_user" ();

CREATE
OR REPLACE FUNCTION "public"."handle_user_update" () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET
    search_path = '' AS $$
BEGIN
  UPDATE "public"."profiles"
  SET
    "name" = NEW."raw_user_meta_data" ->> 'name',
    "email" = NEW."raw_user_meta_data" ->> 'email',
    "cpf" = NEW."raw_user_meta_data" ->> 'cpf',
    "phone" = NEW."raw_user_meta_data" ->> 'phone',
    "gender" = COALESCE(
      NULLIF(NEW."raw_user_meta_data" ->> 'gender', '')::"public"."gender", 
      NULL
    ),
    "birth" = COALESCE(
      NULLIF(
        NULLIF(NEW."raw_user_meta_data" ->> 'birth', ''), 
        'null'
      )::DATE, 
      NULL
    )  
  WHERE "id" = NEW."id";
  RETURN NEW;
END;
$$;

CREATE TRIGGER "on_auth_user_updated"
AFTER
UPDATE ON "auth"."users" FOR EACH ROW
EXECUTE FUNCTION "public"."handle_user_update" ();
