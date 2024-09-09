CREATE FUNCTION public.handle_new_user () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET
    search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name
  )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'name'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user ();

CREATE
OR REPLACE FUNCTION public.handle_user_update () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET
    search_path = '' AS $$
BEGIN
  UPDATE public.profiles
  SET
    name = new.raw_user_meta_data ->> 'name',
    email = new.raw_user_meta_data ->> 'email',
    cpf = new.raw_user_meta_data ->> 'cpf',
    phone = new.raw_user_meta_data ->> 'phone',
    gender = COALESCE(NULLIF(new.raw_user_meta_data ->> 'gender', '')::public.gender, NULL),
    birth = COALESCE(
                    NULLIF(
                      NULLIF(NEW.raw_user_meta_data ->> 'birth', ''),
                      'null'
                    )::date,
                    NULL
                  )  WHERE id = new.id;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_updated
AFTER
UPDATE ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_user_update ();
