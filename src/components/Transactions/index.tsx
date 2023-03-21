import { useSession } from '@supabase/auth-helpers-react';
import { BiTransfer, BiNote } from 'react-icons/bi';
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs';
import { MdNumbers, MdOutlineDateRange, MdTextFormat } from 'react-icons/md';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from '../../helper/transaction';
import { toCurrency } from '../../helper';
import { useError } from '../../context/ErrorContext';
import { useCommand } from '../../context/CommandContext';
import { useEffect } from 'react';
import { parseParams } from '../../helper/parser';

export default function Transactions() {
  const session = useSession();
  const user = session?.user;

  const { setError } = useError();
  const command = useCommand();
  const queryClient = useQueryClient();

  queryClient.setDefaultOptions({
    mutations: {
      onSuccess: () => {
        setError(null);
      },
      onError: (err) => {
        setError(err);
      },
    },
  });

  // TODO: fetchTransaction shouldn't need userid from FE ...
  // it could have gotten from BE directly
  const data = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => await fetchTransactions(user?.id),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  });

  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['budgets']);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['budgets']);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['budgets']);
    },
  });

  useEffect(() => {
    const inputSplits = command.toLowerCase().split(' ');
    const action = inputSplits[0];
    const target = inputSplits[1];

    function handleCreate() {
      const params = inputSplits.slice(2).join(' ');

      if (target !== 't' && target !== 'transaction') {
        setError('Invalid create command!');
        return;
      }

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
    }

    function handleDelete() {
      const targetId = inputSplits[2];

      if (target !== 't' && target !== 'transaction') {
        setError('Invalid delete command!');
        return;
      }

      setError(null);
      deleteTransactionMutation.mutate(+targetId);
    }

    function handleUpdate() {
      const targetId = inputSplits[2];
      const params = inputSplits.slice(3).join(' ');

      if (target !== 't' && target !== 'transaction') {
        setError('Invalid update command!');
        return;
      }

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
    }

    const actionHandlers: Record<string, VoidFunction> = {
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

  return (
    <section className='card'>
      <div className='text-green-600 flex items-center mb-2 p-2'>
        <span className='mr-2'>
          <i className='text-2xl'>
            <BiTransfer />
          </i>
        </span>
        <h1 className='m-0 font-bold'>Transactions</h1>
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
            <th>
              <div className='flex items-center justify-center'>
                <BsArrowDownLeft className='mr-1' />
                <span>From</span>
              </div>
            </th>
            <th className='flex items-center justify-center'>
              <div className='flex items-center justify-center'>
                <BsArrowUpRight className='mr-1' /> <span>To</span>
              </div>
            </th>
            <th>
              <div className='flex items-center justify-center'>
                <MdNumbers className='mr-1' />
                <span>Amount</span>
              </div>
            </th>
            <th>
              <div className='flex items-center justify-center'>
                <MdTextFormat className='mr-1' />
                <span>Budget</span>
              </div>
            </th>
            <th>
              <div className='flex items-center justify-center'>
                <BiNote className='mr-1' />
                <span>Note</span>
              </div>
            </th>
            <th className='pr-3 rounded-r-md'>
              <div className='flex items-center justify-center'>
                <MdOutlineDateRange className='mr-1' />
                <span>Date</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data?.map((transaction) => (
            <tr key={transaction.id}>
              <td className='pl-3 text-gray-400 text-left text-sm'>{transaction.id}</td>
              <td>{transaction.name}</td>
              <td>{transaction.sender_name}</td>
              <td>{transaction.receiver_name}</td>
              <td className='text-right'>{toCurrency(transaction.amount)}</td>
              <td>{transaction.budget_name}</td>
              <td>{transaction.note}</td>
              <td className='pr-3'>{transaction.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
