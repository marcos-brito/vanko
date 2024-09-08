create table "public"."profiles" (
  id uuid not null references auth.users on delete cascade,
  name varchar(150),
  email varchar(254),
  cpf char(11),
  phone char(11),
  gender varchar(9) check (gender in ('feminino', 'masculino', 'outro')),
  birth date,
  is_admin boolean default FALSE,
  status varchar(8) check (status in ('ativo', 'inativo')) default 'ativo',
  ranking smallint default 1
);

alter table public.profiles enable row level security;

create
or replace function public.handle_new_user () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
  insert into public.profiles (
    id,
    name
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

CREATE
OR REPLACE FUNCTION public.handle_user_update () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path = '' AS $$
BEGIN
  UPDATE public.profiles
  SET
    name = NEW.raw_user_meta_data ->> 'name',
    email = NEW.raw_user_meta_data ->> 'email',
    cpf = NEW.raw_user_meta_data ->> 'cpf',
    phone = NEW.raw_user_meta_data ->> 'phone',
    gender = NEW.raw_user_meta_data ->> 'gender',
birth = COALESCE(
                NULLIF(
                  NULLIF(NEW.raw_user_meta_data ->> 'birth', ''),
                  'null'
                )::date,
                NULL
              )  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_updated
AFTER
UPDATE ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_user_update ();
