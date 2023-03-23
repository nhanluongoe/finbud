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

alter table public.budgets
add column user_id uuid not null references auth.users on delete cascade;

-- Functions

-- update
create or replace function update_budget (
  id int4,
  name text default null,
  amount numeric default null
) returns int4
as $$
begin
  update public.budgets b
  set b.name = coalesce(update_budget.name, b.name),
      b.amount = coalesce(update_budget.amount, b.amount),
      b.remaining = b.remaining + coalesce(update_budget.amount, b.amount) - b.amount
  where b.id = update_budget.id;

  return id;
end
$$ language plpgsql;

