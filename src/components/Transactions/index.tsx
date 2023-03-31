import { BiTransfer, BiNote } from 'react-icons/bi';
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs';
import { MdNumbers, MdOutlineDateRange, MdTextFormat } from 'react-icons/md';

import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addTransaction,
  deleteTransaction,
  fetchTransactionCounts,
  fetchTransactions,
  updateTransaction,
  toCurrency,
  parseParams,
} from '../../helper';
import { useSetError } from '../../context/ErrorContext';
import { useCommand } from '../../context/CommandContext';
import { useEffect, useState } from 'react';
import Pagination from '../Pagination';
import useFilter from '../../hooks/useFilter';
import Filter from '../Filter';
import Empty from '../Empty';
import { Wobbling } from '../LoadingIndicator';
import { useSetTargetMap, useTargetMap } from '../../context/TargetMapContext';
import { mapId, retrieveId } from '../../helper/targetMap';

const PAGE_SIZE = 20;

function invalidateQueriesOnMutating(queryClient: QueryClient, setError: React.Dispatch<unknown>) {
  return () => {
    setError(null);
    queryClient.invalidateQueries(['transactions']);
    queryClient.invalidateQueries(['accounts']);
    queryClient.invalidateQueries(['budgets']);
    queryClient.invalidateQueries(['transaction-counts']);
  };
}

export default function Transactions() {
  const { setError } = useSetError();
  const command = useCommand();
  const { setTargetMap } = useSetTargetMap();
  const { targetMap } = useTargetMap();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const { date, setMonth, setYear } = useFilter();

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, date.month, date.year],
    queryFn: () => fetchTransactions(page, PAGE_SIZE, date.month, date.year),
    select: (res) => res.data,
    onSuccess: (data) => {
      if (!data) return;

      setTargetMap((prevMap) => {
        const newMap = new Map(prevMap);
        data.forEach((account) => {
          newMap.set(account.id, mapId(account.id));
        });

        return newMap;
      });
    },
  });

  const { data: transactionCounts } = useQuery({
    queryKey: ['transaction-counts', date.month, date.year],
    queryFn: () => fetchTransactionCounts(date.month, date.year),
  });
  const totalPages = Math.ceil((transactionCounts ?? 0) / PAGE_SIZE);

  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  useEffect(() => {
    const inputSplits = command.split(' ');
    const action = inputSplits[0]?.toLowerCase();
    const target = inputSplits[1]?.toLowerCase();

    function handleFilter() {
      if (target !== 't' && target !== 'transaction') {
        return;
      }

      const params = inputSplits.slice(2).join(' ');
      const { month, m, year, y } = parseParams(params);
      const _month = month ?? m;
      const _year = year ?? y;

      if (_month) {
        setMonth(+_month);
      }

      if (_year) {
        setYear(+_year);
      }
    }

    function handleNavigation(direction: 'next' | 'previous') {
      if (target !== 't' && target !== 'transaction') {
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

      if (target !== 't' && target !== 'transaction') {
        return;
      }

      const { name, n, from, f, to, t, amount, a, date, d, budget, b, note, no } =
        parseParams(params);
      const _name = name ?? n;
      const _from = from ?? f;
      const _to = to ?? t;
      const _amount = amount ?? a ?? 0;
      const _date = date ?? d ?? new Date().toISOString();
      const _budget = budget ?? b;
      const _note = note ?? no;

      addTransactionMutation.mutate({
        name: _name,
        sender_id: _from ? retrieveId(_from, targetMap) : null,
        receiver_id: _to ? retrieveId(_to, targetMap) : null,
        amount: +_amount,
        budget_id: _budget ? retrieveId(_budget, targetMap) : null,
        note: _note,
        created_at: _date,
      });
    }

    function handleDelete() {
      const targetId = retrieveId(inputSplits[2], targetMap);

      if (!targetId) {
        return;
      }

      if (target !== 't' && target !== 'transaction') {
        return;
      }
      deleteTransactionMutation.mutate(targetId);
    }

    function handleUpdate() {
      const targetId = retrieveId(inputSplits[2], targetMap);
      const params = inputSplits.slice(3).join(' ');

      if (!targetId) {
        return;
      }

      if (target !== 't' && target !== 'transaction') {
        return;
      }

      const {
        name,
        n,
        from,
        f,
        to,
        t,
        amount,
        a,
        budget,
        b,
        note,
        no,
        date = new Date().toISOString(),
        d,
      } = parseParams(params);
      const _name = name ?? n;
      const _from = from ?? f;
      const _to = to ?? t;
      const _amount = amount ?? a;
      const _budget = budget ?? b;
      const _note = note ?? no;
      const _date = date ?? d ?? new Date().toISOString();
      updateTransactionMutation.mutate({
        id: targetId,
        name: _name,
        sender_id: _from ? +_from : null,
        receiver_id: _to ? +_to : null,
        amount: _amount ? +_amount : null,
        budget_id: _budget ? +_budget : null,
        note: _note,
        created_at: _date,
      });
    }

    const actionHandlers: Record<string, VoidFunction> = {
      f: handleFilter,
      filter: handleFilter,
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
      <div className='flex items-center mb-2 p-2'>
        <div className='text-green-600 flex items-center'>
          <span className='mr-2'>
            <i className='text-2xl'>
              <BiTransfer />
            </i>
          </span>
          <h1 className='m-0 font-bold'>Transactions</h1>
          <span className='text-hint'>t</span>
        </div>
        <Filter date={date} className='flex-grow-0 ml-auto' />
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
                  <span className='text-hint'>n</span>
                </div>
              </th>
              <th>
                <div className='flex items-center justify-center'>
                  <BsArrowDownLeft className='mr-1' />
                  <span>From</span>
                  <span className='text-hint'>f</span>
                </div>
              </th>
              <th className='flex items-center justify-center'>
                <div className='flex items-center justify-center'>
                  <BsArrowUpRight className='mr-1' /> <span>To</span>
                  <span className='text-hint'>t</span>
                </div>
              </th>
              <th>
                <div className='flex items-center justify-center'>
                  <MdNumbers className='mr-1' />
                  <span>Amount</span>
                  <span className='text-hint'>a</span>
                </div>
              </th>
              <th>
                <div className='flex items-center justify-center'>
                  <MdTextFormat className='mr-1' />
                  <span>Budget</span>
                  <span className='text-hint'>b</span>
                </div>
              </th>
              <th>
                <div className='flex items-center justify-center'>
                  <BiNote className='mr-1' />
                  <span>Note</span>
                  <span className='text-hint'>no</span>
                </div>
              </th>
              <th className='pr-3 rounded-r-md'>
                <div className='flex items-center justify-center'>
                  <MdOutlineDateRange className='mr-1' />
                  <span>Date</span>
                  <span className='text-hint'>d</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((transaction) => (
              <tr key={transaction.id}>
                <td className='pl-3 text-gray-400 text-left text-sm'>
                  {targetMap.get(transaction.id)}
                </td>
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
