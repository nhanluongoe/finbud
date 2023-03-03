import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseAccountParams, parseParams } from '../../helper/parser';
import { addAccount, deleteAccount, updateAccount } from '../../helper/account';

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

  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
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

      case 'update' || 'u': {
        const target = inputSplits[1];
        const targetId = inputSplits[2];
        const params = inputSplits.slice(3).join(' ');

        switch (target) {
          case 'account': {
            const { name, balance } = parseParams(params);
            updateAccountMutation.mutate({
              id: +targetId,
              name,
              balance: +balance,
            });
            break;
          }
          default: {
            break;
          }
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
