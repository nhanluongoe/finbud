import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/initSupabase';
import { Database } from '../lib/schema';
import { Transaction } from '../types';

export async function fetchTransactions(
  userId: string | undefined,
): Promise<
  PostgrestSingleResponse<Database['public']['Functions']['get_transactions']['Returns']>
> {
  if (!userId) {
    throw new Error("User doesn't exist");
  }

  return await supabase
    .rpc('get_transactions', { user_id: userId })
    .order('id', { ascending: true });
}

export async function addTransaction(transaction: Transaction['Insert']) {
  const { name, sender_id, receiver_id, amount, budget_id, note } = transaction;

  const _name = name ?? undefined;
  const _sender_id = sender_id ?? undefined;
  const _receiver_id = receiver_id ?? undefined;
  const _budget_id = budget_id ?? undefined;
  const _amount = amount ?? undefined;
  const _note = note ?? undefined;

  return await supabase.rpc('add_transaction', {
    name: _name,
    sender: _sender_id,
    receiver: _receiver_id,
    amount: _amount,
    budget: _budget_id,
    note: _note,
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
