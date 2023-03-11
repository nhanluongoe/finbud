import { useQuery } from '@tanstack/react-query';
import { MdNumbers, MdTextFormat } from 'react-icons/md';
import { BsBox } from 'react-icons/bs';

import { fetchBudgets, toCurrency } from '../../helper';

export default function Budgets() {
  const { data } = useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
  });

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
