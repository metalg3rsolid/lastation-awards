create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  ip_hash text not null,
  votes jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists submissions_ip_hash_unique on submissions(ip_hash);
create unique index if not exists submissions_username_unique on submissions(lower(username));
