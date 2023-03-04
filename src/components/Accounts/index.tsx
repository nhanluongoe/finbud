import { useQuery } from '@tanstack/react-query';
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
      <h1>Accounts</h1>
      <table className='table-auto w-full'>
        <thead className='text-left uppercase bg-gray-200 text-text-secondary rounded-md mb-2 text-sm'>
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
