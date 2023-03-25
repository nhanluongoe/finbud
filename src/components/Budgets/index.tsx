import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MdNumbers, MdTextFormat } from 'react-icons/md';
import { BsBox } from 'react-icons/bs';

import {
  addBudget,
  deleteBudget,
  fetchBudgetCounts,
  fetchBudgets,
  toCurrency,
  updateBudget,
} from '../../helper';
import { useError } from '../../context/ErrorContext';
import { useCommand } from '../../context/CommandContext';
import { useEffect, useState } from 'react';
import { parseParams } from '../../helper/parser';
import Pagination from '../Pagination';
import useFilter from '../../hooks/useFilter';
import Filter from '../Filter';
import { Wobbling } from '../LoadingIndicator';
import Empty from '../Empty';

const PAGE_SIZE = 10;

export default function Budgets() {
  const { setError } = useError();
  const command = useCommand();
  const queryClient = useQueryClient();

  queryClient.setDefaultOptions({
    queries: {
      staleTime: Infinity,
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
  const { date, setMonth, setYear } = useFilter();

  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets', page, date.month, date.year],
    queryFn: () => fetchBudgets(page, PAGE_SIZE, date.month, date.year),
    select: (data) => data.data,
  });

  const { data: budgetCounts } = useQuery({
    queryKey: ['budget-counts', date.month, date.year],
    queryFn: () => fetchBudgetCounts(date.month, date.year),
    select: (data) => data.count,
  });
  const totalPages = Math.ceil((budgetCounts ?? 0) / PAGE_SIZE);

  const addBudgetMutation = useMutation({
    mutationFn: addBudget,
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
    },
  });

  useEffect(() => {
    const inputSplits = command.toLowerCase().split(' ');
    const action = inputSplits[0];
    const target = inputSplits[1];

    function handleFilter() {
      if (target !== 'b' && target !== 'budget') {
        return;
      }

      const params = inputSplits.slice(2).join(' ');
      const { month, year } = parseParams(params);

      if (month) {
        setMonth(+month);
      }

      if (year) {
        setYear(+year);
      }
    }

    function handleNavigation(direction: 'next' | 'previous') {
      if (target !== 'b' && target !== 'budget') {
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

      if (target !== 'b' && target !== 'budget') {
        setError('Invalid create command!');
        return;
      }

      setError(null);
      const { name, amount = 0 } = parseParams(params);
      addBudgetMutation.mutate({
        name,
        amount: +amount,
      });
    }

    function handleDelete() {
      const targetId = inputSplits[2];

      if (target !== 'b' && target !== 'budget') {
        setError('Invalid delete command!');
        return;
      }

      setError(null);
      deleteBudgetMutation.mutate(+targetId);
    }

    function handleUpdate() {
      const targetId = inputSplits[2];
      const params = inputSplits.slice(3).join(' ');

      if (target !== 'b' && target !== 'budget') {
        setError('Invalid update command!');
        return;
      }

      setError(null);
      const { name, amount } = parseParams(params);
      const _amount = amount ? +amount : null;
      updateBudgetMutation.mutate({
        id: +targetId,
        name,
        amount: _amount,
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
    } else {
      setError('Invalid command!');
    }
  }, [command]);

  return (
    <section className='card'>
      <div className='flex items-center mb-2 p-2'>
        <div className='text-green-600 flex items-center'>
          <span className='mr-2'>
            <i className='text-2xl'>
              <BsBox />
            </i>
          </span>
          <h1 className='m-0 font-bold'>Budgets</h1>
        </div>
        <Filter date={date} className='flex-grow-0 ml-auto' />
      </div>
      {isLoading ? (
        <Wobbling />
      ) : !budgets || budgets.length === 0 ? (
        <Empty />
      ) : (
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
                    <span>Amount</span>
                  </div>
                </th>
                <th className='pr-3 rounded-r-md'>
                  <div className='flex items-center justify-center'>
                    <MdNumbers className='mr-1' />
                    <span>Remaining</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td className='pl-3 text-gray-400 text-left text-sm'>{budget.id}</td>
                  <td>{budget.name}</td>
                  <td className='text-right'>{toCurrency(budget.amount ?? 0)}</td>
                  <td className='pr-3 text-right'>{toCurrency(budget.remaining ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} className='justify-end' />
        </>
      )}
    </section>
  );
}
