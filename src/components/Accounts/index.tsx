import { useQuery } from '@tanstack/react-query';
import { RiBankCard2Fill } from 'react-icons/ri';

import { fetchAccounts } from '../../helper/account';

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
            <th className='pl-3 rounded-l-md'>Id</th>
            <th>Name</th>
            <th className='pr-3 rounded-r-md'>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((account, index) => (
            <tr
              key={account.id}
              // className={`${index % 2 === 0 ? '' : 'bg-slate-100'} text-text-secondary`}
            >
              <td className='pl-3'>{account.id}</td>
              <td>{account.name}</td>
              <td className='pr-3'>{account.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
