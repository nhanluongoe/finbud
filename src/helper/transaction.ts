import { supabase } from '../lib/initSupabase';

export async function fetchTransactions(userId: string | undefined) {
  if (!userId) {
    throw new Error("User doesn't exist!");
  }

  return await supabase.rpc('get_transactions', { user_id: userId });
}
