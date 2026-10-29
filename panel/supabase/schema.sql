-- =====================================================================
-- Panel central · Holding MVCK
-- Base de datos de artistas, contratos y tareas de las 4 empresas.
--
-- Cómo usarlo: en Supabase abre «SQL Editor», pega TODO este archivo y
-- pulsa «Run». Se puede volver a correr sin perder datos.
-- =====================================================================

-- ---------- Empresas del Holding ----------
create table if not exists public.empresas (
  id text primary key,
  nombre text not null,
  color text not null,
  orden int not null default 0
);

insert into public.empresas (id, nombre, color, orden) values
  ('mvck-music', 'Mvck Music', '#00afd8', 1),
  ('mvck-publishing', 'MVCK Publishing', '#f49d00', 2),
  ('maverick-records', 'Maverick Records', '#ffffff', 3),
  ('maverick-live', 'Maverick Live', '#e50041', 4)
on conflict (id) do update
  set nombre = excluded.nombre, color = excluded.color, orden = excluded.orden;

-- ---------- Equipo (un perfil por cada usuario que entra al panel) ----------
-- rol: 'admin' = project manager (maneja el equipo y los plazos)
--      'ceo'   = además es el único que puede marcar un contrato como firmado
--      'equipo'= ve todo y trabaja sus tareas
create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  email text not null,
  area text not null default 'Ventas y Marketing'
    check (area in ('Dirección', 'Creativo', 'Ventas y Marketing', 'Prensa', 'Relaciones Públicas')),
  rol text not null default 'equipo' check (rol in ('admin', 'ceo', 'equipo')),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

-- Cada usuario nuevo de Supabase recibe su perfil. El PRIMERO es admin; los
-- demás quedan inactivos hasta que un admin los crea desde «Equipo» (así,
-- aunque alguien se registre por su cuenta, no ve nada).
create or replace function public.nuevo_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, email, rol, activo)
  select
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'nombre', ''), split_part(new.email, '@', 1)),
    new.email,
    case when primero then 'admin' else 'equipo' end,
    primero
  from (select not exists (select 1 from public.perfiles) as primero) x
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.nuevo_perfil();

-- Ayudantes para los permisos (security definer para no entrar en bucle).
create or replace function public.mi_rol()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.perfiles where id = auth.uid() and activo
$$;

create or replace function public.es_equipo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.perfiles where id = auth.uid() and activo)
$$;

create or replace function public.es_jefe()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.mi_rol() in ('admin', 'ceo'), false)
$$;

-- ---------- Configuración general ----------
create table if not exists public.configuracion (
  clave text primary key,
  valor text not null
);

insert into public.configuracion (clave, valor) values ('regalias_meses', '3')
on conflict (clave) do nothing;

-- ---------- Artistas (una sola ficha por artista para todo el Holding) ----------
create table if not exists public.artistas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  nombre_artistico text not null,
  nombre_legal text,
  documento text,
  nacimiento date,
  email text,
  telefono text,
  pais text,
  ciudad text,
  tipo text,
  genero text,
  manager text,
  bio text,
  redes jsonb not null default '{}'::jsonb,
  comentarios text,
  estado text not null default 'Nuevo'
    check (estado in ('Nuevo', 'En proceso', 'Activo', 'Pausado', 'Descartado')),
  regalias_meses int not null default 3 check (regalias_meses between 1 and 24),
  origen text not null default 'Panel',
  creado_en timestamptz not null default now(),
  creado_por uuid references public.perfiles (id) on delete set null default auth.uid()
);

create unique index if not exists artistas_email_unico
  on public.artistas (lower(email)) where email is not null and email <> '';

-- Con qué empresas trabaja cada artista (puede ser más de una).
create table if not exists public.artista_empresas (
  artista_id uuid not null references public.artistas (id) on delete cascade,
  empresa_id text not null references public.empresas (id),
  estado text not null default 'En proceso'
    check (estado in ('En proceso', 'Activo', 'Pausado', 'Terminado')),
  respuestas jsonb not null default '{}'::jsonb,
  desde date not null default current_date,
  primary key (artista_id, empresa_id)
);

-- ---------- Plazos: el procedimiento de cada empresa ----------
-- Lo mismo que el manual de procedimientos. Se edita desde «Ajustes».
-- {meses} se reemplaza por la frecuencia de regalías del artista.
create table if not exists public.plantillas_tareas (
  id bigint generated always as identity primary key,
  empresa_id text not null references public.empresas (id) on delete cascade,
  paso int not null,
  tarea text not null,
  area text not null
    check (area in ('Dirección', 'Creativo', 'Ventas y Marketing', 'Prensa', 'Relaciones Públicas')),
  dias int not null check (dias >= 0),
  unique (empresa_id, paso)
);

insert into public.plantillas_tareas (empresa_id, paso, tarea, area, dias) values
  ('mvck-music', 1, 'Revisar la solicitud y aprobar al artista', 'Dirección', 2),
  ('mvck-music', 2, 'Enviar contrato de distribución y recibirlo firmado', 'Dirección', 5),
  ('mvck-music', 3, 'Recibir masters (WAV 24-bit), portada 3000×3000 y metadatos', 'Ventas y Marketing', 7),
  ('mvck-music', 4, 'Asignar códigos ISRC y UPC', 'Ventas y Marketing', 8),
  ('mvck-music', 5, 'Revisar metadatos y créditos según las guías de las plataformas', 'Ventas y Marketing', 9),
  ('mvck-music', 6, 'Subir el lanzamiento (mínimo 3 semanas antes de la fecha)', 'Ventas y Marketing', 10),
  ('mvck-music', 7, 'Pedir perfil verificado en Spotify for Artists y Apple Music for Artists', 'Ventas y Marketing', 12),
  ('mvck-music', 8, 'Enviar pitch editorial a Spotify (mínimo 7 días antes)', 'Ventas y Marketing', 14),
  ('mvck-music', 9, 'Nota de prensa del lanzamiento a medios', 'Prensa', 14),
  ('mvck-music', 10, 'Confirmar que salió en todas las plataformas y mandar los links al artista', 'Ventas y Marketing', 30),
  ('mvck-music', 11, 'Configurar reportes y liquidación de regalías cada {meses} meses', 'Dirección', 35),

  ('mvck-publishing', 1, 'Revisar la solicitud y el catálogo del autor', 'Ventas y Marketing', 2),
  ('mvck-publishing', 2, 'Enviar contrato editorial y recibirlo firmado', 'Dirección', 7),
  ('mvck-publishing', 3, 'Recibir split sheets firmados (porcentajes por canción)', 'Ventas y Marketing', 10),
  ('mvck-publishing', 4, 'Reunir datos de cada autor: nombre legal, IPI/CAE y sociedad', 'Ventas y Marketing', 10),
  ('mvck-publishing', 5, 'Registrar las obras en SCD o la sociedad que corresponda', 'Ventas y Marketing', 15),
  ('mvck-publishing', 6, 'Registrar en The MLC (EE.UU.) y subeditores internacionales', 'Ventas y Marketing', 20),
  ('mvck-publishing', 7, 'Registrar en YouTube Content ID', 'Ventas y Marketing', 20),
  ('mvck-publishing', 8, 'Vincular los ISRC de las grabaciones con los ISWC de las obras', 'Ventas y Marketing', 25),
  ('mvck-publishing', 9, 'Configurar la liquidación de regalías cada {meses} meses', 'Dirección', 30),

  ('maverick-records', 1, 'Escuchar demos y hacer evaluación A&R', 'Dirección', 7),
  ('maverick-records', 2, 'Reunión con el artista (y su manager)', 'Dirección', 14),
  ('maverick-records', 3, 'Preparar propuesta de contrato y negociar', 'Dirección', 21),
  ('maverick-records', 4, 'Firmar contrato discográfico', 'Dirección', 30),
  ('maverick-records', 5, 'Armar plan de lanzamiento: singles, fechas y presupuesto', 'Dirección', 35),
  ('maverick-records', 6, 'Producción, grabación, mezcla y master', 'Creativo', 60),
  ('maverick-records', 7, 'Arte y contenido: portada, fotos y video', 'Creativo', 60),
  ('maverick-records', 8, 'Plan de marketing y redes', 'Ventas y Marketing', 65),
  ('maverick-records', 9, 'Comunicado de prensa del fichaje y del lanzamiento', 'Prensa', 65),
  ('maverick-records', 10, 'Gestión de medios: entrevistas, radios y playlists', 'Prensa', 75),
  ('maverick-records', 11, 'Presentar al artista a la industria y buscar alianzas', 'Relaciones Públicas', 75),
  ('maverick-records', 12, 'Pasar el lanzamiento a distribución (Mvck Music)', 'Ventas y Marketing', 70),

  ('maverick-live', 1, 'Recibir rider técnico y de camarín', 'Creativo', 5),
  ('maverick-live', 2, 'Definir formato del show: duración, banda o DJ', 'Ventas y Marketing', 7),
  ('maverick-live', 3, 'Ficha de booking: fee, disponibilidad y ciudades', 'Ventas y Marketing', 10),
  ('maverick-live', 4, 'Firmar contrato de booking / representación', 'Dirección', 14),
  ('maverick-live', 5, 'Actualizar kit de prensa (EPK)', 'Creativo', 14),
  ('maverick-live', 6, 'Ofrecer el show a productoras, festivales y venues', 'Relaciones Públicas', 21),
  ('maverick-live', 7, 'Difundir los shows confirmados en medios', 'Prensa', 28),
  ('maverick-live', 8, 'Coordinar logística: viajes, hospedaje y transporte', 'Ventas y Marketing', 30),
  ('maverick-live', 9, 'Producción del show el día del evento', 'Dirección', 30),
  ('maverick-live', 10, 'Liquidación después de cada evento', 'Dirección', 45)
on conflict (empresa_id, paso) do nothing;

-- ---------- Contratos ----------
create table if not exists public.contratos (
  id uuid primary key default gen_random_uuid(),
  artista_id uuid not null references public.artistas (id) on delete cascade,
  empresa_id text not null references public.empresas (id),
  tipo text not null,
  estado text not null default 'Borrador'
    check (estado in ('Borrador', 'Enviado al artista', 'Firmado', 'Vencido', 'Terminado')),
  inicio date,
  fin date,
  regalias_meses int check (regalias_meses between 1 and 24),
  porcentaje_artista numeric(5, 2) check (porcentaje_artista between 0 and 100),
  documento_url text,
  notas text,
  firmado_por uuid references public.perfiles (id) on delete set null,
  firmado_en timestamptz,
  creado_en timestamptz not null default now()
);

-- Solo el CEO (Sebastián) puede marcar un contrato como «Firmado».
create or replace function public.revisar_firma()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.estado = 'Firmado'
     and (tg_op = 'INSERT' or old.estado is distinct from 'Firmado') then
    if auth.uid() is not null and coalesce(public.mi_rol(), '') <> 'ceo' then
      raise exception 'Solo el CEO puede marcar un contrato como firmado';
    end if;
    new.firmado_por := auth.uid();
    new.firmado_en := now();
  elsif new.estado <> 'Firmado' then
    new.firmado_por := null;
    new.firmado_en := null;
  else
    new.firmado_por := old.firmado_por;
    new.firmado_en := old.firmado_en;
  end if;
  return new;
end;
$$;

drop trigger if exists antes_de_firmar on public.contratos;
create trigger antes_de_firmar
  before insert or update on public.contratos
  for each row execute function public.revisar_firma();

-- ---------- Tareas ----------
create table if not exists public.tareas (
  id uuid primary key default gen_random_uuid(),
  artista_id uuid not null references public.artistas (id) on delete cascade,
  empresa_id text references public.empresas (id),
  paso int,
  titulo text not null,
  area text not null
    check (area in ('Dirección', 'Creativo', 'Ventas y Marketing', 'Prensa', 'Relaciones Públicas')),
  responsable_id uuid references public.perfiles (id) on delete set null,
  vence date,
  estado text not null default 'Pendiente' check (estado in ('Pendiente', 'En curso', 'Hecha')),
  hecha_por uuid references public.perfiles (id) on delete set null,
  hecha_en timestamptz,
  creado_en timestamptz not null default now()
);

create index if not exists tareas_pendientes on public.tareas (vence) where estado <> 'Hecha';
create index if not exists tareas_artista on public.tareas (artista_id);

create or replace function public.marcar_hecha()
returns trigger
language plpgsql
as $$
begin
  if new.estado = 'Hecha' and old.estado is distinct from 'Hecha' then
    new.hecha_por := auth.uid();
    new.hecha_en := now();
  elsif new.estado <> 'Hecha' then
    new.hecha_por := null;
    new.hecha_en := null;
  else
    new.hecha_por := old.hecha_por;
    new.hecha_en := old.hecha_en;
  end if;
  return new;
end;
$$;

drop trigger if exists al_cambiar_tarea on public.tareas;
create trigger al_cambiar_tarea
  before update on public.tareas
  for each row execute function public.marcar_hecha();

-- Cuando un artista se suma a una empresa, se crean solas las tareas de su
-- procedimiento, con fecha de vencimiento según «Plazos».
create or replace function public.crear_tareas_empresa()
returns trigger
language plpgsql
as $$
begin
  insert into public.tareas (artista_id, empresa_id, paso, titulo, area, vence)
  select
    new.artista_id,
    p.empresa_id,
    p.paso,
    replace(p.tarea, '{meses}', a.regalias_meses::text),
    p.area,
    new.desde + p.dias
  from public.plantillas_tareas p
  join public.artistas a on a.id = new.artista_id
  where p.empresa_id = new.empresa_id;
  return new;
end;
$$;

drop trigger if exists al_sumar_empresa on public.artista_empresas;
create trigger al_sumar_empresa
  after insert on public.artista_empresas
  for each row execute function public.crear_tareas_empresa();

-- ---------- Notas e historial de cada artista ----------
create table if not exists public.notas (
  id uuid primary key default gen_random_uuid(),
  artista_id uuid not null references public.artistas (id) on delete cascade,
  autor_id uuid references public.perfiles (id) on delete set null default auth.uid(),
  texto text not null,
  creado_en timestamptz not null default now()
);

-- =====================================================================
-- Permisos (Row Level Security): solo el equipo activo ve y cambia datos.
-- =====================================================================
alter table public.empresas enable row level security;
alter table public.perfiles enable row level security;
alter table public.configuracion enable row level security;
alter table public.artistas enable row level security;
alter table public.artista_empresas enable row level security;
alter table public.plantillas_tareas enable row level security;
alter table public.contratos enable row level security;
alter table public.tareas enable row level security;
alter table public.notas enable row level security;

do $$
declare t text;
begin
  -- Borrar políticas viejas para poder correr el archivo de nuevo.
  for t in select tablename || '.' || policyname from pg_policies where schemaname = 'public' loop
    execute format('drop policy %I on public.%I', split_part(t, '.', 2), split_part(t, '.', 1));
  end loop;
end $$;

-- Ver: todo el equipo ve todo.
create policy ver on public.empresas for select to authenticated using (public.es_equipo());
create policy ver on public.perfiles for select to authenticated using (public.es_equipo());
create policy ver on public.configuracion for select to authenticated using (public.es_equipo());
create policy ver on public.artistas for select to authenticated using (public.es_equipo());
create policy ver on public.artista_empresas for select to authenticated using (public.es_equipo());
create policy ver on public.plantillas_tareas for select to authenticated using (public.es_equipo());
create policy ver on public.contratos for select to authenticated using (public.es_equipo());
create policy ver on public.tareas for select to authenticated using (public.es_equipo());
create policy ver on public.notas for select to authenticated using (public.es_equipo());

-- Trabajar: el equipo crea y edita artistas, contratos, tareas y notas.
create policy crear on public.artistas for insert to authenticated with check (public.es_equipo());
create policy editar on public.artistas for update to authenticated using (public.es_equipo());
create policy crear on public.artista_empresas for insert to authenticated with check (public.es_equipo());
create policy editar on public.artista_empresas for update to authenticated using (public.es_equipo());
create policy crear on public.contratos for insert to authenticated with check (public.es_equipo());
create policy editar on public.contratos for update to authenticated using (public.es_equipo());
create policy crear on public.tareas for insert to authenticated with check (public.es_equipo());
create policy editar on public.tareas for update to authenticated using (public.es_equipo());
create policy crear on public.notas for insert to authenticated with check (public.es_equipo());
create policy borrar on public.notas for delete to authenticated using (autor_id = auth.uid() or public.es_jefe());

-- Solo admin y CEO: borrar, cambiar plazos, configuración y equipo.
create policy borrar on public.artistas for delete to authenticated using (public.es_jefe());
create policy borrar on public.artista_empresas for delete to authenticated using (public.es_jefe());
create policy borrar on public.contratos for delete to authenticated using (public.es_jefe());
create policy borrar on public.tareas for delete to authenticated using (public.es_jefe());
create policy crear on public.plantillas_tareas for insert to authenticated with check (public.es_jefe());
create policy editar on public.plantillas_tareas for update to authenticated using (public.es_jefe());
create policy borrar on public.plantillas_tareas for delete to authenticated using (public.es_jefe());
create policy editar on public.configuracion for update to authenticated using (public.es_jefe());
create policy editar on public.perfiles for update to authenticated using (public.es_jefe());
