-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text check (role in ('admin','user')) default 'user'
);

-- PROJECTS
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  amplasament text,
  status text default 'in_grafic',
  zile_ramase int,
  termen date,
  responsabil text references users(username),
  created_at timestamp default now()
);

-- ARCHIVE
create table projects_archive (
  id uuid primary key,
  client_name text,
  amplasament text,
  status text,
  responsabil text,
  archived_at timestamp default now(),
  archived_by text
);

-- HISTORY
create table history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  action text,
  performed_by text,
  created_at timestamp default now()
);
