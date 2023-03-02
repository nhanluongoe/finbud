import { supabase } from '../../lib/initSupabase';
import useProfile from '../hooks/useProfile';

export default function Header() {
  const { firstName, lastName } = useProfile();

  return (
    <header>
      <div>
        <p>Hi {`${firstName} ${lastName}`}</p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
          }}
        >
          logout
        </button>
      </div>
    </header>
  );
}
