import { useSession } from '@supabase/auth-helpers-react';
import { BiTransfer } from 'react-icons/bi';

import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../../helper/transaction';
import { toCurrency } from '../../helper';

export default function Transactions() {
  const session = useSession();
  const user = session?.user;

  const data = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => await fetchTransactions(user?.id),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
  });

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
            <th className='pl-3 rounded-l-md'>Id</th>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Note</th>
            <th className='pr-3 rounded-r-md'>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.data?.map((transaction) => (
            <tr key={transaction.id}>
              <td className='pl-3'>{transaction.id}</td>
              <td>{transaction.name}</td>
              <td>{transaction.sender_name}</td>
              <td>{transaction.receiver_name}</td>
              <td>{toCurrency(transaction.amount)}</td>
              <td>{transaction.note}</td>
              <td className='pr-3'>{transaction.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
