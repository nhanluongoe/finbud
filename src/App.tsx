import { useSession } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';

import { Layout } from './components';
import { Accounts } from './components';

import { supabase } from './lib/initSupabase';

function App() {
  const session = useSession();

  if (!session) {
    return <Auth supabaseClient={supabase} theme='dark' />;
  }

  return (
    <Layout>
      <div className='border-2 border-red-500'>
        <Accounts />
      </div>
    </Layout>
  );
}

export default App;
