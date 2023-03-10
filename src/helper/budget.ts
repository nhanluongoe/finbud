import { supabase } from '../lib/initSupabase';
import { Budget } from '../types';

export async function fetchBudgets() {
  return await supabase.from('budgets').select().order('id', { ascending: true });
}

export async function addBudget(budget: Omit<Budget['Insert'], 'remaining, created_at'>) {
  return await supabase.from('budgets').insert({
    ...budget,
    remaining: budget.amount,
  });
}

export async function deleteBudget(id: number) {
  return await supabase.from('budgets').delete().eq('id', id);
}
