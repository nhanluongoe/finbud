import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdNumbers, MdTextFormat } from 'react-icons/md';
import { RiBankCard2Fill } from 'react-icons/ri';
import { useCommand } from '../../context/CommandContext';
import { useError } from '../../context/ErrorContext';

import { addAccount, deleteAccount, fetchAccounts, toCurrency, updateAccount } from '../../helper';
import { parseParams } from '../../helper/parser';

export default function Accounts() {
  const { setError } = useError();
  const command = useCommand();
  const queryClient = useQueryClient();

  queryClient.setDefaultOptions({
    queries: {
      onSuccess: () => {
        setError(null);
      },
      onError: (err) => {
        setError(err);
      },
    },
    mutations: {
      onSuccess: () => {
        setError(null);
      },
      onError: (err) => {
        setError(err);
      },
    },
  });

  const [page, setPage] = useState(0);

  const { data } = useQuery({
    queryKey: ['accounts', page],
    queryFn: () => fetchAccounts(page),
    select: (data) => data.data,
    staleTime: 3 * 60 * 1000,
  });

  const addAccountMutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['transactions']);
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
    },
  });

  useEffect(() => {
    const inputSplits = command.toLowerCase().split(' ');
    const action = inputSplits[0];
    const target = inputSplits[1];

    function handleNavigation(direction: 'next' | 'previous') {
      if (target === 'a' || target === 'account') {
        setPage((page) => (direction === 'next' ? ++page : --page));
      }
    }

    function handleCreate() {
      const params = inputSplits.slice(2).join(' ');

      if (target !== 'a' && target !== 'account') {
        setError('Invalid create command!');
        return;
      }

      setError(null);
      const { name, balance = 0 } = parseParams(params);
      addAccountMutation.mutate({ name, balance: +balance });
    }

    function handleDelete() {
      const targetId = inputSplits[2];

      if (target !== 'a' && target !== 'account') {
        setError('Invalid delete command!');
        return;
      }

      setError(null);
      deleteAccountMutation.mutate(+targetId);
    }

    function handleUpdate() {
      const targetId = inputSplits[2];
      const params = inputSplits.slice(3).join(' ');

      if (target !== 'a' && target !== 'account') {
        setError('Invalid update command!');
        return;
      }

      setError(null);
      const { name, balance } = parseParams(params);
      updateAccountMutation.mutate({
        id: +targetId,
        name,
        balance: balance === undefined ? balance : +balance,
      });
    }

    const actionHandlers: Record<string, VoidFunction> = {
      n: () => handleNavigation('next'),
      next: () => handleNavigation('next'),
      p: () => handleNavigation('previous'),
      previous: () => handleNavigation('previous'),
      c: handleCreate,
      create: handleCreate,
      d: handleDelete,
      delete: handleDelete,
      u: handleUpdate,
      update: handleUpdate,
    };

    const handler = actionHandlers[action];

    if (handler) {
      handler();
    } else {
      setError('Invalid command!');
    }
  }, [command]);

  if (!data) return null;

  return (
    <section className='card'>
      <div className='text-green-600 flex items-center mb-2 p-2'>
        <span className='mr-2'>
          <i className='text-2xl'>
            <RiBankCard2Fill />
          </i>
        </span>
        <h1 className='m-0 font-bold'>Accounts</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th className='pl-3 rounded-l-md'></th>
            <th>
              <div className='flex items-center justify-center'>
                <MdTextFormat className='mr-1' />
                <span>Name</span>
              </div>
            </th>
            <th className='pr-3 rounded-r-md'>
              <div className='flex items-center justify-center'>
                <MdNumbers className='mr-1' />
                <span>Balance</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((account) => (
            <tr key={account.id}>
              <td className='pl-3 text-gray-400 text-left text-sm'>{account.id}</td>
              <td>{account.name}</td>
              <td className='pr-3 text-right'>{toCurrency(account.balance ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
