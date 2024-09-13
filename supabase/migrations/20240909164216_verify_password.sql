CREATE
OR REPLACE FUNCTION "public"."verify_user_password" ("user_id" TEXT, "password" TEXT) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER
SET
    search_path = "extensions",
    "public",
    "auth" AS $$
BEGIN
    ASSERT "user_id" IS NOT NULL, 'user_id should not be null';
    ASSERT "password" IS NOT NULL, 'password should not be null';

  RETURN EXISTS (
    SELECT "id"
    FROM "auth"."users"
    WHERE "id" = "user_id"::UUID
      AND "encrypted_password" = crypt("password", "encrypted_password")
  );
END;
$$;
