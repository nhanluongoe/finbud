import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoIosArrowForward } from 'react-icons/io';

import { parseParams } from '../../helper/parser';
import { useRef, useState } from 'react';
import useEventListener from '../../hooks/useEventLister';
import { useError } from '../../context/ErrorContext';
import { supabase } from '../../lib/initSupabase';
import {
  addAccount,
  addBudget,
  addTransaction,
  deleteAccount,
  deleteBudget,
  deleteTransaction,
  updateAccount,
  updateBudget,
  updateTransaction,
} from '../../helper';
import { useCommandHistory } from '../../context/CommandHistoryContext';

export default function CommandLine() {
  const { history, setHistory } = useCommandHistory();

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
      queryClient.invalidateQueries(['budgets']);
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
      queryClient.invalidateQueries(['budgets']);
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

  const updateBudgetMutation = useMutation({
    mutationFn: updateBudget,
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

    // Add command to history
    setHistory?.((history) => [...history, eventTarget.command.value]);

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
            const { name, from, to, amount = 0, budget, note } = parseParams(params);
            const _to = to ? +to : null;
            const _from = from ? +from : null;
            const _budget = budget ? +budget : null;
            addTransactionMutation.mutate({
              name,
              sender_id: _from,
              receiver_id: _to,
              amount: +amount,
              budget_id: _budget,
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
            const { name, from, to, amount, budget, note } = parseParams(params);
            const _from = from ? +from : null;
            const _to = to ? +to : null;
            const _amount = amount ? +amount : null;
            const _budget = budget ? +budget : null;
            updateTransactionMutation.mutate({
              id: +targetId,
              name,
              sender_id: _from,
              receiver_id: _to,
              amount: _amount,
              budget_id: _budget,
              note,
            });
            break;
          }
          case 'b':
          case 'budget': {
            setError(null);
            const { name, amount } = parseParams(params);
            const _amount = amount ? +amount : null;
            updateBudgetMutation.mutate({
              id: +targetId,
              name,
              amount: _amount,
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

  /*
   * Use up arrow or down arrow to retrive command history
   * */
  const historyCount = useRef<number>(-1);
  const retrieveHistory = (e: any) => {
    const isInputActive = inputRef.current === document.activeElement;

    if (!isInputActive) return;

    if (!inputRef.current) return;

    const historyLength = history.length;

    if (historyLength === 0) return;

    switch (e.key) {
      case 'ArrowUp': {
        if (historyCount.current < historyLength - 1) {
          historyCount.current++;
        }
        const previousCommand = history[historyLength - 1 - historyCount.current];

        inputRef.current.value = previousCommand;
        break;
      }
      case 'ArrowDown': {
        if (historyCount.current > 0) {
          historyCount.current--;
        }

        if (historyCount.current < 0) return;

        const nextCommand = history[historyLength - 1 - historyCount.current];

        inputRef.current.value = nextCommand;
        break;
      }
      default: {
        historyCount.current = -1;
      }
    }
  };

  useEventListener('keyup', retrieveHistory);

  if (!visible) {
    return null;
  }

  return (
    <div className={`fixed block w-full h-full top-0 left-0 right-0 bottom-0`}>
      <div className='flex justify-start items-end w-full h-full pb-7 px-5'>
        <form onSubmit={handleSubmit} className='w-full'>
          <p className='text-gray-500 mb-1'>
            Type &quot;help&quot; to show a quick introduction about the commands!
          </p>
          <div className='flex items-center w-full  rounded-md border-green-600 border py-1 px-2 bg-canvas-50'>
            <span className='text-green-600'>
              <IoIosArrowForward />
            </span>
            <input
              className='text-gray-600 w-full'
              name='command'
              ref={inputRef}
              autoComplete='off'
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
}
