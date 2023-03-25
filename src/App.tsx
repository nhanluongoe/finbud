import { useSession } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';

import {
  Accounts,
  CommandError,
  CommandLine,
  Layout,
  Transactions,
  Help,
  Budgets,
} from './components';
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
      <Help />
      <CommandHistoryProvider>
        <CommandLine />
      </CommandHistoryProvider>
      <CommandError />
    </Layout>
  );
}

export default App;
