import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdNumbers, MdTextFormat } from 'react-icons/md';
import { RiBankCard2Fill } from 'react-icons/ri';

import { useCommand } from '../../context/CommandContext';
import { useSetError } from '../../context/ErrorContext';
import {
  addAccount,
  deleteAccount,
  fetchAccountCounts,
  fetchAccounts,
  toCurrency,
  updateAccount,
  parseParams,
} from '../../helper';
import Empty from '../Empty';
import { Wobbling } from '../LoadingIndicator';
import Pagination from '../Pagination';

const PAGE_SIZE = 5;

function invalidateQueriesOnMutating(queryClient: QueryClient, setError: React.Dispatch<unknown>) {
  return () => {
    setError(null);
    queryClient.invalidateQueries(['accounts']);
    queryClient.invalidateQueries(['transactions']);
    queryClient.invalidateQueries(['account-counts']);
  };
}

export default function Accounts() {
  const { setError } = useSetError();
  const command = useCommand();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['accounts', page],
    queryFn: () => fetchAccounts(page, PAGE_SIZE),
    select: (data) => data.data,
  });

  const { data: accountCounts } = useQuery({
    queryKey: ['account-counts'],
    queryFn: fetchAccountCounts,
    select: (data) => data.count,
  });
  const totalPages = Math.ceil((accountCounts ?? 0) / PAGE_SIZE);

  const addAccountMutation = useMutation({
    mutationFn: addAccount,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  useEffect(() => {
    const inputSplits = command.toLowerCase().split(' ');
    const action = inputSplits[0];
    const target = inputSplits[1];

    function handleNavigation(direction: 'next' | 'previous') {
      if (target !== 'a' && target !== 'account') {
        return;
      }

      setPage((page) => {
        const atFirstPageAndBack = page === 0 && direction === 'previous';
        const atLastPageAndNext = page === totalPages - 1 && direction === 'next';

        if (atFirstPageAndBack || atLastPageAndNext) return page;

        return direction === 'next' ? page + 1 : page - 1;
      });
    }

    function handleCreate() {
      const params = inputSplits.slice(2).join(' ');

      if (target !== 'a' && target !== 'account') {
        return;
      }

      const { name, n, balance, b } = parseParams(params);
      const _name = name ?? n;
      const _balance = balance ?? b ?? 0;
      addAccountMutation.mutate({ name: _name, balance: +_balance });
    }

    function handleDelete() {
      const targetId = inputSplits[2];

      if (target !== 'a' && target !== 'account') {
        return;
      }

      deleteAccountMutation.mutate(+targetId);
    }

    function handleUpdate() {
      const targetId = inputSplits[2];
      const params = inputSplits.slice(3).join(' ');

      if (target !== 'a' && target !== 'account') {
        return;
      }

      const { name, n, balance, b } = parseParams(params);
      const _name = name ?? n;
      const _balance = balance ?? b;
      updateAccountMutation.mutate({
        id: +targetId,
        name: _name,
        balance: _balance === undefined ? _balance : +_balance,
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
    }
  }, [command]);

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
      <>
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
            {data?.map((account) => (
              <tr key={account.id}>
                <td className='pl-3 text-gray-400 text-left text-sm'>{account.id}</td>
                <td>{account.name}</td>
                <td className='pr-3 text-right'>{toCurrency(account.balance ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading ? (
          <Wobbling />
        ) : !data || data.length === 0 ? (
          <Empty />
        ) : (
          <Pagination page={page} totalPages={totalPages} className='justify-end' />
        )}
      </>
    </section>
  );
}
