create table public.budgets (
  id serial not null,
  name text,
  amount numeric default 0,
  remaining numeric default 0,
  created_at date default now(),

  primary key (id);
)

alter table public.budgets enable row level security;

create policy "Public budgets are viewable by authenticated users"
on public.budgets for select
to authenticated
using (
  true
);


create policy "Authenticated users can update their budgets"
on public.budgets for update using (
  auth.role() = 'authenticated'
);

create policy "Enable insert for authenticated users only" on public.budgets for insert with check (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.budgets for delete to authenticated using (true);

