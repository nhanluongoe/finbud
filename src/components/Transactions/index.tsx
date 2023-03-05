import { useSession } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../../helper/transaction';

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
      <h1>Transactions</h1>

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
              <td>{transaction.amount}</td>
              <td>{transaction.note}</td>
              <td className='pr-3'>{transaction.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
