import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
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
import TargetMapProvider from '../context/TargetMapContext';

function Home() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  return (
    <Layout>
      <TargetMapProvider>
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
      </TargetMapProvider>
      <CommandHistoryProvider>
        <CommandLine />
      </CommandHistoryProvider>
      <CommandError />
      <Help />
    </Layout>
  );
}

export default Home;
