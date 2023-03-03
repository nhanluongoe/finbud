import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseAccountParams, parseParams } from '../../helper/parser';
import { addAccount, deleteAccount, updateAccount } from '../../helper/account';
import { useRef } from 'react';
import useEventListener from '../../hooks/useEventLister';

export default function CommandLine() {
  const inputRef = useRef<HTMLInputElement>(null);

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

    switch (command.toLowerCase()) {
      case 'create': {
        const target = inputSplits[1];
        const params = inputSplits.slice(2).join(' ');

        switch (target) {
          case 'account': {
            const { name, balance = 0 } = parseParams(params);
            addAccountMutation.mutate({ name, balance: +balance });
            break;
          }
          default:
            break;
        }
        break;
      }

      case 'delete': {
        const target = inputSplits[1];
        const targetId = inputSplits[2];

        switch (target.toLowerCase()) {
          case 'account': {
            deleteAccountMutation.mutate({ id: +targetId });
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
              balance: balance === undefined ? balance : +balance,
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

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    hideInput();
  };

  const hideInput = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const focusInput = (e: any) => {
    const isInputActive = inputRef.current === document.activeElement;

    if (e.key === 'Escape') {
      hideInput();
    }

    if (!isInputActive && inputRef.current) {
      switch (e.key) {
        case ':': {
          inputRef.current.value = '';
          inputRef.current.focus();
          break;
        }
      }
    }
  };

  useEventListener('keyup', focusInput);

  return (
    <div className='my-2 border-red-500 border'>
      <form onSubmit={handleSubmit}>
        <input className='w-full block' name='command' ref={inputRef}></input>
      </form>
    </div>
  );
}
