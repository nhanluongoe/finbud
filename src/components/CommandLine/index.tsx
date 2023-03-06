import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseParams } from '../../helper/parser';
import { addAccount, deleteAccount, updateAccount } from '../../helper/account';
import { useRef, useState } from 'react';
import useEventListener from '../../hooks/useEventLister';
import { addTransaction } from '../../helper/transaction';

export default function CommandLine() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const queryClient = useQueryClient();

  /**
   * Account
   **/
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
      queryClient.invalidateQueries(['transactions'], { exact: true });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts'], { exact: true });
    },
  });

  /**
   * Account
   **/
  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
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
      case 'c':
      case 'create': {
        const target = inputSplits[1];
        const params = inputSplits.slice(2).join(' ');

        switch (target) {
          case 'account': {
            const { name, balance = 0 } = parseParams(params);
            addAccountMutation.mutate({ name, balance: +balance });
            break;
          }
          case 'transaction': {
            const { from, to, amount = 0, note } = parseParams(params);
            const _to = to ? +to : null;
            const _from = from ? +from : null;
            addTransactionMutation.mutate({
              sender_id: _from,
              receiver_id: _to,
              amount: +amount,
              note,
            });
            break;
          }
          default:
            break;
        }
        break;
      }

      case 'd':
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

      case 'u':
      case 'update': {
        const target = inputSplits[1];
        const targetId = inputSplits[2];
        const params = inputSplits.slice(3).join(' ');

        switch (target) {
          case 'account': {
            const { name, balance } = parseParams(params);
            console.log(balance);
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
    setVisible(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const focusInput = (e: any) => {
    const isInputActive = inputRef.current === document.activeElement;

    if (e.key === 'Escape') {
      hideInput();
    }

    if (!isInputActive) {
      switch (e.key) {
        case 'i': {
          setVisible(true);
          if (!inputRef.current) return;
          inputRef.current.value = '';
          inputRef.current.focus();
          break;
        }
      }
    }
  };

  useEventListener('keyup', focusInput);

  if (!visible) {
    return null;
  }

  return (
    <div className={`fixed block w-full h-full top-0 left-0 right-0 bottom-0 bg-backdrop`}>
      <div className='flex justify-center items-center w-full h-full'>
        <form onSubmit={handleSubmit} className='w-2/3'>
          <input
            className='w-full block rounded-md border-slate-200 py-1 px-2 bg-canvas-50'
            name='command'
            ref={inputRef}
            autoComplete='off'
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          ></input>
        </form>
      </div>
    </div>
  );
}
