import useProfile from '../../hooks/useProfile';
import { supabase } from '../../lib/initSupabase';

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
