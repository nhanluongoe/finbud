import { useSession } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';

import { CommandLine, Layout } from './components';
import { Accounts } from './components';
import CommandError from './components/CommandError';
import Transactions from './components/Transactions';

import { supabase } from './lib/initSupabase';

function App() {
  const session = useSession();

  if (!session) {
    return <Auth supabaseClient={supabase} theme='dark' />;
  }

  return (
    <Layout>
      <div>
        <Accounts />
      </div>
      <div>
        <Transactions />
      </div>
      <CommandLine />
      <CommandError />
    </Layout>
  );
}

export default App;
