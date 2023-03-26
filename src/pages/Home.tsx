import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';

import {
  Accounts,
  CommandError,
  CommandLine,
  Layout,
  Transactions,
  Help,
  Budgets,
} from '../components';
import CommandHistoryProvider from '../context/CommandHistoryContext';

// import { supabase } from '../lib/initSupabase';

function Home() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
      // return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
    }
  }, [session, navigate]);

  return (
    <Layout>
      <section className='mb-5 flex items-stretch gap-4'>
        <div className='flex-1'>
          <Accounts />
        </div>
        <div className='flex-1'>
          <Budgets />
        </div>
      </section>
      <section>
        <Transactions />
      </section>
      <CommandHistoryProvider>
        <CommandLine />
      </CommandHistoryProvider>
      <CommandError />
      <Help />
    </Layout>
  );
}

export default Home;
