drop table public.accounts;

create table public.accounts (
  id int8 not null,
  user_id uuid not null references auth.users on delete cascade,
  name text,
  balance numeric,

  primary key (id)
);

alter table public.accounts enable row level security;

create policy "Public accounts are viewable by authenticated users"
on accounts for select
to authenticated
using (
  true
);


create policy "Users can update their own accounts"
  on accounts for update using (
    auth.uid() = user_id
  );

CREATE POLICY "Enable insert for authenticated users only" ON public.accounts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.accounts FOR DELETE to authenticated using (true);
