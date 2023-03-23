import { supabase } from '../lib/initSupabase';

export async function getUserId() {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  if (!userId) {
    throw new Error("User doesn't exist!");
  }

  return userId;
}
