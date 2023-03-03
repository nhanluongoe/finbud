import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseAccountParams } from '../../helper/parser';
import { addAccount, deleteAccount } from '../Accounts/helper';

export default function CommandLine() {
  const queryClient = useQueryClient();

  const addAccountMutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts'], { exact: true });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts'], { exact: true });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eventTarget = e.target as typeof e.target & {
      command: { value: string };
    };

    const inputSplits = eventTarget.command.value.split(' ');

    const command = inputSplits[0];
    const target = inputSplits[1];
    const params = inputSplits[2];

    switch (command.toLowerCase()) {
      case 'create': {
        switch (target) {
          case 'account': {
            const { name, balance } = parseAccountParams(params);
            addAccountMutation.mutate({ name, balance });
            break;
          }
          default:
            break;
        }
        break;
      }
      case 'delete': {
        switch (target.toLowerCase()) {
          case 'account': {
            const { name } = parseAccountParams(params);
            deleteAccountMutation.mutate({ name });
            break;
          }
          default:
            break;
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className='my-2 border-red-500 border'>
      <form onSubmit={handleSubmit}>
        <input name='command'></input>
      </form>
    </div>
  );
}
