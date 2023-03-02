import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '../../lib/initSupabase';
import { Account } from '../../types';

async function addAccount(account: Omit<Account['Insert'], 'user_id'>) {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  if (!userId) {
    throw new Error("User doesn't exist ");
  }

  await supabase.from('accounts').insert({
    user_id: userId,
    name: account.name,
    balance: account.balance,
  });
}

export default function CommandLine() {
  const queryClient = useQueryClient();

  const addAccountMutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts'], { exact: true });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      command: { value: string };
    };

    const command = target.command.value;

    const accountName = command.split(' ')[1];
    const accountBalance = +command.split(' ')[2];

    addAccountMutation.mutate({
      name: accountName,
      balance: accountBalance,
    });

    console.log(target.command);
  };

  return (
    <div className='my-2 border-red-500 border'>
      <form onSubmit={handleSubmit}>
        <input name='command'></input>
      </form>
    </div>
  );
}
