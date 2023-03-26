import { useSession } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/initSupabase';

async function getCurrentProfile() {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  return supabase.from('profiles').select().eq('id', userId);
}

export default function useProfile() {
  // TODO: handle to save this data to local storage for later use to save api call
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: getCurrentProfile,
    select: (data) => data.data,
    staleTime: Infinity,
  });

  const session = useSession();
  const email = session?.user.email;

  console.log(session);

  const profile = data?.[0];
  const firstName = profile?.first_name ?? '';
  const lastName = profile?.last_name ?? '';

  return {
    firstName,
    lastName,
    email,
  };
}
