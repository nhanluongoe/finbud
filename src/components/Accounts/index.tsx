import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from '../../helper/account';
import { Database } from '../../lib/schema';

export default function Accounts() {
  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
    select: (data) => data.data,
    staleTime: 3 * 60 * 1000,
  });

  if (!data) return null;

  return (
    <section>
      <p>Accounts</p>
      <div>
        {data.map((account) => (
          <Account key={account.id} account={account} />
        ))}
      </div>
    </section>
  );
}

type Account = Database['public']['Tables']['accounts']['Row'];

interface IAccountProps {
  account: Account;
}

function Account(props: IAccountProps) {
  const { account } = props;

  return (
    <div>
      <p>
        {account.name} - {account.balance}
      </p>
    </div>
  );
}
