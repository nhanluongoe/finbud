-- Create Transactions table
create table public.transactions (
  id serial not null,
  sender_id int8 references public.accounts on delete cascade,
  receiver_id int8 references public.accounts on delete cascade,
  name text,
  amount numeric default 0,
  note text,
  created_at date default now(),

  primary key (id)
);

alter table public.transactions enable row level security;

create policy "Public transactions are viewable by authenticated users"
on transactions for select
to authenticated
using (
  true
);


create policy "Authenticated users can update transactions"
on transactions for update using (
  auth.role() = 'authenticated'
);

create policy "Enable insert for authenticated users only" on public.transactions for insert with check (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" public.transactions for delete to authenticated using (true);

-- Functions
create or replace function delete_transaction(id) returns int as $$
declare
  s_id int8;
  r_id int8;
  amt numeric;
begin
          select t.sender_id, t.receiver_id
          from public.transactions t
          where t.id = delete_transaction.id
          returning sender_id, receiver_id, amount into s_id, r_id, amt;

          update public.accounts
          set balance = balance + amt
          where id = s_id;

          update public.accounts
          set balance = balance - amt
          where id = r_id;

          returns delete_transaction.id;
end
$$ language plpgsql;

create or replace function get_transactions(user_id text) returns table (
  id int,
  sender_id int8,
  receiver_id int8,
  name text,
  amount numeric,
  note text,
  created_at date,
  sender_name text,
  receiver_name text
) as $$
begin
  return query select distinct t.*, acs.name as sender_name, acr.name as receiver_name
          from public.transactions t
          left join public.accounts acs
          on t.sender_id = acs.id
          left join public.accounts acr
          on t.receiver_id = acr.id
          where acr.user_id = get_transactions.user_id::uuid or acs.user_id = get_transactions.user_id::uuid;
end
$$ language plpgsql;


create or replace function delete_transaction(id int) returns int as $$
declare
  s_id int8;
  r_id int8;
  amt numeric;
begin
          select t.sender_id, t.receiver_id, t.amount
          from public.transactions t
          where t.id = delete_transaction.id
          into s_id, r_id, amt;

          delete from transactions t
          where t.id = delete_transaction.id;

          update public.accounts a
          set balance = balance + amt
          where a.id = s_id;

          update public.accounts a
          set balance = balance - amt
          where a.id = r_id;

          return delete_transaction.id;
end
$$ language plpgsql;

