import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/initSupabase';
import { Database } from '../lib/schema';
import { Transaction } from '../types';

export async function fetchTransactions(
  page = 0,
  pageSize = 20,
): Promise<
  PostgrestSingleResponse<Database['public']['Functions']['get_transactions']['Returns']>
> {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  if (!userId) {
    throw new Error("User doesn't exist");
  }

  return await supabase
    .rpc('get_transactions', { user_id: userId })
    .range(page * pageSize, (page + 1) * pageSize)
    .order('created_at', { ascending: true });
}

export async function fetchTransactionCounts() {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  if (!userId) {
    throw new Error("User doesn't exist");
  }

  const transactions = await supabase.rpc('get_transactions', { user_id: userId });

  if (!transactions.data) {
    return 0;
  }

  return transactions.data.length;
}

export async function addTransaction(transaction: Transaction['Insert']) {
  const { name, sender_id, receiver_id, amount, budget_id, created_at, note } = transaction;

  return await supabase.rpc('add_transaction', {
    name: name ?? undefined,
    sender: sender_id ?? undefined,
    receiver: receiver_id ?? undefined,
    amount: amount ?? undefined,
    budget: budget_id ?? undefined,
    note: note ?? undefined,
    created_at: created_at ?? undefined,
  });
}

export async function deleteTransaction(id: number) {
  return await supabase.rpc('delete_transaction', {
    id,
  });
}

export async function updateTransaction(transaction: Transaction['Update']) {
  const {
    id,
    name,
    sender_id: senderId,
    receiver_id: receiverId,
    amount,
    budget_id: budgetId,
    note,
  } = transaction;

  if (!id) {
    throw new Error("Transaction doesn't exist");
  }

  return await supabase.rpc('update_transaction', {
    id: id,
    name: name ?? undefined,
    sender: senderId ?? undefined,
    receiver: receiverId ?? undefined,
    amount: amount ?? undefined,
    budget: budgetId ?? undefined,
    note: note ?? undefined,
  });
}
