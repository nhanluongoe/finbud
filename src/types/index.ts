import { Database } from '../lib/schema';

export type Account = Database['public']['Tables']['accounts'];

export type Profile = Database['public']['Tables']['profiles'];

export type Transaction = Database['public']['Tables']['transactions'];

export type Budget = Database['public']['Tables']['budgets'];
