import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseParams } from '../../helper/parser';
import { addAccount, deleteAccount, updateAccount } from '../../helper/account';
import { useRef, useState } from 'react';
import useEventListener from '../../hooks/useEventLister';
import { addTransaction, deleteTransaction, updateTransaction } from '../../helper/transaction';
import { useError } from '../../context/ErrorContext';
import { supabase } from '../../lib/initSupabase';
import { addBudget, deleteBudget } from '../../helper';

export default function CommandLine() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { setError } = useError();

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
   * Transaction
   **/
  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
    },
    onError: (error) => {
      setError(error);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
    },
    onError: (error) => {
      setError(error);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['budgets']);
    },
    onError: (error) => {
      setError(error);
    },
  });

  /**
   * Budgets
   **/

  const addBudgetMutation = useMutation({
    mutationFn: addBudget,
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries(['budgets']);
    },
    onError: (error) => {
      setError(error);
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries(['budgets']);
    },
    onError: (error) => {
      setError(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eventTarget = e.target as typeof e.target & {
      command: { value: string };
    };

    if (eventTarget.command.value === '') {
      setError(null);
      hideInput();
      return;
    }

    const inputSplits = eventTarget.command.value.split(' ');
    const command = inputSplits[0];

    switch (command.toLowerCase()) {
      // Auth
      case 'logout': {
        await supabase.auth.signOut();
        break;
      }
      // Crud
      case 'c':
      case 'create': {
        const target = inputSplits[1];
        const params = inputSplits.slice(2).join(' ');

        switch (target) {
          case 'a':
          case 'account': {
            setError(null);
            const { name, balance = 0 } = parseParams(params);
            addAccountMutation.mutate({ name, balance: +balance });
            break;
          }
          case 't':
          case 'transaction': {
            setError(null);
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
          case 'b':
          case 'budget': {
            setError(null);
            const { name, amount = 0 } = parseParams(params);
            addBudgetMutation.mutate({
              name,
              amount: +amount,
            });
            break;
          }
          default:
            setError('Invalid create command!');
            break;
        }
        break;
      }

      case 'd':
      case 'delete': {
        const target = inputSplits[1];
        const targetId = inputSplits[2];

        switch (target.toLowerCase()) {
          case 'a':
          case 'account': {
            setError(null);
            deleteAccountMutation.mutate(+targetId);
            break;
          }
          case 't':
          case 'transaction': {
            setError(null);
            deleteTransactionMutation.mutate(+targetId);
            break;
          }
          case 'b':
          case 'budget': {
            setError(null);
            deleteBudgetMutation.mutate(+targetId);
            break;
          }
          default:
            setError('Invalid delete command!');
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
          case 'a':
          case 'account': {
            setError(null);
            const { name, balance } = parseParams(params);
            updateAccountMutation.mutate({
              id: +targetId,
              name,
              balance: balance === undefined ? balance : +balance,
            });
            break;
          }
          case 't':
          case 'transaction': {
            setError(null);
            const { name, from, to, amount, note } = parseParams(params);
            const _from = from ? +from : null;
            const _to = to ? +to : null;
            const _amount = amount ? +amount : null;
            updateTransactionMutation.mutate({
              id: +targetId,
              name,
              sender_id: _from,
              receiver_id: _to,
              amount: _amount,
              note,
            });
            break;
          }
          default: {
            setError('Invalid update command!');
            break;
          }
        }
        break;
      }

      default:
        setError('Invalid command!');
        break;
    }

    hideInput();
  };

  const hideInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

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
      <div className='flex justify-start items-end w-full h-full pb-7 px-5'>
        <form onSubmit={handleSubmit} className='w-full'>
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
