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
  const { sender_id, receiver_id, amount, note } = transaction;

  const _amount = amount ?? 0;
  const _note = note ?? '';

  if (receiver_id && sender_id) {
    return await supabase.rpc('full_transaction', {
      sender: sender_id,
      receiver: receiver_id,
      amount: _amount,
      note: _note,
    });
  }

  if (sender_id) {
    return await supabase.rpc('out_transaction', {
      sender: sender_id,
      amount: _amount,
      note: _note,
    });
  }

  if (receiver_id) {
    return await supabase.rpc('in_transaction', {
      receiver: receiver_id,
      amount: _amount,
      note: _note,
    });
  }

  throw new Error('Either sender or receiver must be present');
}

export async function deleteTransaction(id: number) {
  return await supabase.rpc('delete_transaction', {
    id,
  });
}

export async function updateTransaction(transaction: Transaction['Update']) {
  const { id, name, sender_id: senderId, receiver_id: receiverId, amount, note } = transaction;

  if (!id) {
    throw new Error("Transaction doesn't exist");
  }

  return await supabase.rpc('update_transaction', {
    id: id,
    name: name ?? undefined,
    sender: senderId ?? undefined,
    receiver: receiverId ?? undefined,
    amount: amount ?? undefined,
    note: note ?? undefined,
  });
}
