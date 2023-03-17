import { useSession } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';

import { CommandLine, Layout } from './components';
import { Accounts } from './components';
import Budgets from './components/Budgets';
import CommandError from './components/CommandError';
import Transactions from './components/Transactions';
import CommandHistoryProvider from './context/CommandHistoryContext';

import { supabase } from './lib/initSupabase';

function App() {
  const session = useSession();

  if (!session) {
    return <Auth supabaseClient={supabase} theme='dark' />;
  }

  return (
    <Layout>
      <section className='mb-5 flex items-stretch gap-4'>
        <div className='flex-grow'>
          <Accounts />
        </div>
        <div className='flex-grow'>
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
    </Layout>
  );
}

export default App;
