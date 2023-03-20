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

  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
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
    const inputSplits = command.split(' ');
    const action = inputSplits[0];

    switch (action.toLowerCase()) {
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
