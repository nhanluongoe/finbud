import { supabase } from '../lib/initSupabase';
import { Budget } from '../types';
import { getUserId } from './auth';

export async function fetchBudgets(page = 0, pageSize = 5, month: number, year: number) {
  const userId = await getUserId();

  const startDate = `${year}-${month}-01T00:00:00.000Z`;
  const endDate = `${year}-${month + 1}-01T00:00:00.000Z`;

  return await supabase
    .from('budgets')
    .select()
    .eq('user_id', userId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('id', { ascending: true })
    .range(page * pageSize, (page + 1) * pageSize - 1);
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

export async function fetchBudgetCounts(month: number, year: number) {
  const userId = await getUserId();

  const startDate = `${year}-${month}-01T00:00:00.000Z`;
  const endDate = `${year}-${month + 1}-01T00:00:00.000Z`;

  return await supabase
    .from('budgets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);
}
