import { supabase } from '../lib/initSupabase';
import { Budget } from '../types';

export async function fetchBudgets() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const startDate = `${currentYear}-${currentMonth}-01T00:00:00.000Z`;
  const endDate = `${currentYear}-${currentMonth + 1}-01T00:00:00.000Z`;

  return await supabase
    .from('budgets')
    .select()
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('id', { ascending: true });
}

export async function addBudget(budget: Omit<Budget['Insert'], 'remaining' | 'created_at'>) {
  return await supabase.from('budgets').insert({
    ...budget,
    remaining: budget.amount,
  });
}

export async function deleteBudget(id: number) {
  return await supabase.from('budgets').delete().eq('id', id);
}

//TODO: abstract this out to a postgres function
export async function updateBudget(budget: Omit<Budget['Update'], 'remaining'>) {
  const { data: currentBudget } = await supabase
    .from('budgets')
    .select()
    .eq('id', budget.id)
    .limit(1)
    .single();

  const currentRemaining = currentBudget?.remaining;
  const currentAmount = currentBudget?.amount;

  let updatedRemaining;
  if (budget.amount && currentRemaining && currentAmount) {
    updatedRemaining = currentRemaining + budget.amount - currentAmount;
  }

  return await supabase
    .from('budgets')
    .update({
      ...budget,
      remaining: updatedRemaining,
    })
    .eq('id', budget.id);
}
