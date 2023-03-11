import { useQuery } from '@tanstack/react-query';
import { MdNumbers, MdTextFormat } from 'react-icons/md';
import { RiBankCard2Fill } from 'react-icons/ri';

import { fetchAccounts, toCurrency } from '../../helper';

export default function Accounts() {
  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
    select: (data) => data.data,
    staleTime: 3 * 60 * 1000,
  });

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
