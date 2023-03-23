import { supabase } from '../lib/initSupabase';
import { Budget } from '../types';
import { getUserId } from './auth';

export async function fetchBudgets() {
  const userId = await getUserId();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const startDate = `${currentYear}-${currentMonth}-01T00:00:00.000Z`;
  const endDate = `${currentYear}-${currentMonth + 1}-01T00:00:00.000Z`;

  return await supabase
    .from('budgets')
    .select()
    .eq('user_id', userId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('id', { ascending: true });
}

export async function addBudget(
  budget: Omit<Budget['Insert'], 'remaining' | 'created_at' | 'user_id'>,
) {
  const userId = await getUserId();

  return await supabase.from('budgets').insert({
    ...budget,
    remaining: budget.amount,
    user_id: userId,
  });
}

export async function deleteBudget(id: number) {
  return await supabase.from('budgets').delete().eq('id', id);
}

export async function updateBudget(budget: Omit<Budget['Update'], 'remaining'>) {
  if (!budget.id) {
    throw new Error("Budget doesn't exist!");
  }

  return await supabase.rpc('update_budget', {
    id: budget.id,
    name: budget.name ?? undefined,
    amount: budget.amount ?? undefined,
  });
}
