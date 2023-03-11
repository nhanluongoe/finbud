import { useSession } from '@supabase/auth-helpers-react';
import { BiTransfer, BiNote } from 'react-icons/bi';
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs';
import { MdNumbers, MdOutlineDateRange, MdTextFormat } from 'react-icons/md';

import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../../helper/transaction';
import { toCurrency } from '../../helper';

export default function Transactions() {
  const session = useSession();
  const user = session?.user;

  const data = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => await fetchTransactions(user?.id),
    select: (res) => res.data,
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
            <th className='pl-3 rounded-l-md'></th>
            <th>
              <div className='flex items-center justify-center'>
                <MdTextFormat className='mr-1' />
                <span>Name</span>
              </div>
            </th>
            <th>
              <div className='flex items-center justify-center'>
                <BsArrowDownLeft className='mr-1' />
                <span>From</span>
              </div>
            </th>
            <th className='flex items-center justify-center'>
              <div className='flex items-center justify-center'>
                <BsArrowUpRight className='mr-1' /> <span>To</span>
              </div>
            </th>
            <th>
              <div className='flex items-center justify-center'>
                <MdNumbers className='mr-1' />
                <span>Amount</span>
              </div>
            </th>
            <th>
              <div className='flex items-center justify-center'>
                <MdTextFormat className='mr-1' />
                <span>Budget</span>
              </div>
            </th>
            <th>
              <div className='flex items-center justify-center'>
                <BiNote className='mr-1' />
                <span>Note</span>
              </div>
            </th>
            <th className='pr-3 rounded-r-md'>
              <div className='flex items-center justify-center'>
                <MdOutlineDateRange className='mr-1' />
                <span>Date</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data?.map((transaction) => (
            <tr key={transaction.id}>
              <td className='pl-3 text-gray-400 text-left text-sm'>{transaction.id}</td>
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
    </section>
  );
}
