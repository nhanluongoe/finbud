import { supabase } from '../lib/initSupabase';
import { Account } from '../types';

export async function fetchAccounts() {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  return await supabase.from('accounts').select().eq('user_id', userId);
}

export async function addAccount(account: Omit<Account['Insert'], 'user_id'>) {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  if (!userId) {
    throw new Error("User doesn't exist ");
  }

  return await supabase.from('accounts').insert({
    user_id: userId,
    name: account.name,
    balance: account.balance,
  });
}

export async function deleteAccount(account: Account['Update']) {
  return await supabase.from('accounts').delete().eq('id', account.id);
}

