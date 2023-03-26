import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { useSetError } from '../../context/ErrorContext';
import { useCommand } from '../../context/CommandContext';
import { useEffect, useState } from 'react';
import { parseParams } from '../../helper/parser';
import Pagination from '../Pagination';
import useFilter from '../../hooks/useFilter';
import Filter from '../Filter';
import { Wobbling } from '../LoadingIndicator';
import Empty from '../Empty';

const PAGE_SIZE = 10;

function invalidateQueriesOnMutating(queryClient: QueryClient, setError: React.Dispatch<unknown>) {
  return () => {
    setError(null);
    queryClient.invalidateQueries(['budgets']);
    queryClient.invalidateQueries(['budget-counts']);
  };
}

export default function Budgets() {
  const { setError } = useSetError();
  const command = useCommand();
  const queryClient = useQueryClient();

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
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
  });

  const updateBudgetMutation = useMutation({
    mutationFn: updateBudget,
    onSuccess: invalidateQueriesOnMutating(queryClient, setError),
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
        return;
      }

      const { name, n, amount, a } = parseParams(params);
      const _name = name ?? n;
      const _amount = amount ?? a ?? 0;
      addBudgetMutation.mutate({
        name: _name,
        amount: +_amount,
      });
    }

    function handleDelete() {
      const targetId = inputSplits[2];

      if (target !== 'b' && target !== 'budget') {
        return;
      }

      deleteBudgetMutation.mutate(+targetId);
    }

    function handleUpdate() {
      const targetId = inputSplits[2];
      const params = inputSplits.slice(3).join(' ');

      if (target !== 'b' && target !== 'budget') {
        return;
      }

      const { name, n, amount, a } = parseParams(params);
      const _name = name ?? n;
      const _amount = amount ?? a;
      updateBudgetMutation.mutate({
        id: +targetId,
        name: _name,
        amount: _amount ? +_amount : null,
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
              <BsBox />
            </i>
          </span>
          <h1 className='m-0 font-bold'>Budgets</h1>
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
            {budgets?.map((budget) => (
              <tr key={budget.id}>
                <td className='pl-3 text-gray-400 text-left text-sm'>{budget.id}</td>
                <td>{budget.name}</td>
                <td className='text-right'>{toCurrency(budget.amount ?? 0)}</td>
                <td className='pr-3 text-right'>{toCurrency(budget.remaining ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading ? (
          <Wobbling />
        ) : !budgets || budgets.length === 0 ? (
          <Empty />
        ) : (
          <Pagination page={page} totalPages={totalPages} className='justify-end' />
        )}
      </>
    </section>
  );
}
