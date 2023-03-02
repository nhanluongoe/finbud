import { Database } from '../lib/schema';

export type Account = Database['public']['Tables']['accounts'];

export type Profile = Database['public']['Tables']['profiles'];
