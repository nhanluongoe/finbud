import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MdNumbers, MdTextFormat } from 'react-icons/md';
import { BsBox } from 'react-icons/bs';

import { addBudget, deleteBudget, fetchBudgets, toCurrency, updateBudget } from '../../helper';
import { useError } from '../../context/ErrorContext';
import { useCommand } from '../../context/CommandContext';
import { useEffect } from 'react';
import { parseParams } from '../../helper/parser';

export default function Budgets() {
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

  const { data } = useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
  });

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
    const inputSplits = command.split(' ');
    const action = inputSplits[0];

    switch (action.toLowerCase()) {
      // Crud
      case 'c':
      case 'create': {
        const target = inputSplits[1];
        const params = inputSplits.slice(2).join(' ');

        switch (target) {
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
  }, [command]);

  if (!data) return null;

  return (
    <section className='card'>
      <div className='text-green-600 flex items-center mb-2 p-2'>
        <span className='mr-2'>
          <i className='text-2xl'>
            <BsBox />
          </i>
        </span>
        <h1 className='m-0 font-bold'>Budgets</h1>
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
          {data.map((budget) => (
            <tr key={budget.id}>
              <td className='pl-3 text-gray-400 text-left text-sm'>{budget.id}</td>
              <td>{budget.name}</td>
              <td className='text-right'>{toCurrency(budget.amount ?? 0)}</td>
              <td className='pr-3 text-right'>{toCurrency(budget.remaining ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
