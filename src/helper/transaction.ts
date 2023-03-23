import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/initSupabase';
import { Database } from '../lib/schema';
import { Transaction } from '../types';
import { getUserId } from './auth';

export async function fetchTransactions(
  page = 0,
  pageSize = 20,
  month: number,
  year: number,
): Promise<
  PostgrestSingleResponse<Database['public']['Functions']['get_transactions']['Returns']>
> {
  const userId = await getUserId();

  const startDate = `${year}-${month}-01T00:00:00.000Z`;
  const endDate = `${year}-${month + 1}-01T00:00:00.000Z`;

  return await supabase
    .rpc('get_transactions', { user_id: userId })
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .range(page * pageSize, (page + 1) * pageSize)
    .order('created_at', { ascending: true });
}

export async function fetchTransactionCounts(month: number, year: number) {
  const userId = await getUserId();

  const startDate = `${year}-${month}-01T00:00:00.000Z`;
  const endDate = `${year}-${month + 1}-01T00:00:00.000Z`;

  const transactions = await supabase
    .rpc('get_transactions', { user_id: userId })
    .gte('created_at', startDate)
    .lte('created_at', endDate);

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
    created_at,
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
    created_at: created_at ?? undefined,
  });
}
