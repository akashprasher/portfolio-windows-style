create table if not exists public.portfolio_content (
  id text primary key check (id = 'main'),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  email text primary key check (email = lower(email)),
  role text not null check (role in ('super_admin', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;
alter table public.admin_users enable row level security;

grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;
grant select on public.admin_users to authenticated;

-- RLS calls this function to determine write access without exposing the allowlist.
create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
      and role in ('admin', 'super_admin')
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

drop policy if exists "Portfolio is publicly readable" on public.portfolio_content;
create policy "Portfolio is publicly readable"
  on public.portfolio_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can write portfolio content" on public.portfolio_content;
create policy "Admins can write portfolio content"
  on public.portfolio_content for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Admins can read own allowlist entry" on public.admin_users;
create policy "Admins can read own allowlist entry"
  on public.admin_users for select
  to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

-- After applying this migration, bootstrap the first superadmin before signing in:
-- insert into public.admin_users (email, role)
-- values ('your-email@example.com', 'super_admin');
