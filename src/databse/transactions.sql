-- Create Transactions table
create table public.transactions (
  id serial not null,
  sender_id int8 references public.accounts on delete cascade,
  receiver_id int8 references public.accounts on delete cascade,
  name text,
  amount numeric default 0,
  budget_id int8 references public.budgets,
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

-- add
create or replace function add_transaction(
  name text default null,
  sender bigint default null, 
  receiver bigint default null,
  amount numeric default 0,
  budget bigint default null,
  note text default ''
)
returns int as $$
declare
  new_row int8;
begin
  insert into public.transactions (name, sender_id, receiver_id, amount, budget_id, note)
  values (add_transaction.name, add_transaction.sender, add_transaction.receiver, add_transaction.amount, add_transaction.budget, add_transaction.note)
  returning id into new_row;

  if add_transaction.sender is not null then
    update public.accounts
    set balance = balance - add_transaction.amount
    where id = add_transaction.sender;
    
    if add_transaction.budget is not null then
      update public.budgets
      set remaining = remaining - add_transaction.amount
      where id = add_transaction.budget;
    end if;
  end if;

  if add_transaction.receiver is not null then
    update public.accounts
    set balance = balance + add_transaction.amount
    where id = add_transaction.receiver;
  end if;

  return new_row;
end
$$ language plpgsql;

-- get by user
create or replace function get_transactions(user_id text) returns table (
  id int,
  sender_id int8,
  receiver_id int8,
  name text,
  amount numeric,
  budget_id int8,
  note text,
  created_at date,
  sender_name text,
  receiver_name text,
  budget_name text
) as $$
begin
  return query select distinct t.*, acs.name as sender_name, acr.name as receiver_name, b.name as budget_name
          from public.transactions t
          left join public.accounts acs
          on t.sender_id = acs.id
          left join public.accounts acr
          on t.receiver_id = acr.id
          left join public.budgets b
          on t.budget_id = b.id
          where acr.user_id = get_transactions.user_id::uuid or acs.user_id = get_transactions.user_id::uuid;
end
$$ language plpgsql;

-- get by account
create or replace function get_transactions_by_account(id int4)
returns int4
as $$
declare
  result int4;
begin
  select count(*) from public.transactions t
  left join public.accounts acs
  on t.sender_id = acs.id
  left join public.accounts acr
  on t.receiver_id = acr.id
  where acr.id = get_transactions_by_account.id or acs.id = get_transactions_by_account.id
  into result;

  return result;
end
$$ language plpgsql;


-- delete
create or replace function delete_transaction(id int) returns int as $$
declare
  s_id int8;
  r_id int8;
  b_id int8;
  amt numeric;
begin
          select t.sender_id, t.receiver_id, t.budget_id, t.amount
          from public.transactions t
          where t.id = delete_transaction.id
          into s_id, r_id, b_id, amt;

          delete from transactions t
          where t.id = delete_transaction.id;

          update public.accounts a
          set balance = balance + amt
          where a.id = s_id;

          update public.accounts a
          set balance = balance - amt
          where a.id = r_id;

          update public.budgets b
          set remaining = remaining + amt
          where b.id = b_id;


          return delete_transaction.id;
end
$$ language plpgsql;

-- update
create or replace function update_transaction(
  id int, 
  name text DEFAULT NULL, 
  sender int8 DEFAULT NULL, 
  receiver int8 DEFAULT NULL, 
  amount numeric DEFAULT NULL, 
  budget int8 DEFAULT null,
  note text DEFAULT NULL
) returns int as $$
declare
  -- values of current transaction
  c_name text;
  c_s_id int8;
  c_r_id int8;
  c_amt numeric;
  c_b_id int8;
  c_note text;
begin
  select t.name, t.sender_id, t.receiver_id, t.amount, t.budget_id, t.note from public.transactions t
  where t.id = update_transaction.id
  into c_name, c_s_id, c_r_id, c_amt, c_b_id, c_note;

  if c_s_id is not null then
    update public.accounts a
    set balance = balance + c_amt 
    where a.id = c_s_id;
  end if;
    
  update public.accounts a
  set balance = balance - COALESCE(update_transaction.amount, c_amt)
  where a.id = COALESCE(update_transaction.sender, c_s_id);

  if c_r_id is not null then
    update public.accounts a
    set balance = balance - c_amt
    where a.id = c_r_id;
  end if;
    
  update public.accounts a
  set balance = balance + COALESCE(update_transaction.amount, c_amt)
  where a.id = COALESCE(update_transaction.receiver, c_r_id);

  if c_b_id is not null then
    update public.budgets b
    set remaining = remaining + c_amt
    where b.id = c_b_id;
  end if;

  update public.budgets b
  set remaining = remaining - COALESCE(update_transaction.amount, c_amt, 0)
  where b.id = COALESCE(update_transaction.budget, c_b_id);

  update public.transactions t
  set name = COALESCE(update_transaction.name, t.name),
      sender_id = COALESCE(update_transaction.sender, t.sender_id),
      receiver_id = COALESCE(update_transaction.receiver, t.receiver_id),
      amount = COALESCE(update_transaction.amount, t.amount),
      budget_id = COALESCE(update_transaction.budget, t.budget_id),
      note = COALESCE(update_transaction.note, t.note)
  where t.id = update_transaction.id;

  return update_transaction.id;
end
$$ language plpgsql;
