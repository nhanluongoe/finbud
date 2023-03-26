import { useSession } from '@supabase/auth-helpers-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from '../lib/initSupabase';
import { Wobbling } from '../components/LoadingIndicator';

export default function Login() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    navigate('/');
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {loading && <Wobbling />}
      <div className='my-5 flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold my-5'>Login</h1>
        <p className='text-gray-500'>Login to your account</p>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
      <form className='flex flex-col w-1/2 xl:w-1/3 mt-10' onSubmit={handleLogin}>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' className='border border-gray-300 p-2 rounded-md' />
        <label htmlFor='password' className='mt-5'>
          Password
        </label>
        <input type='password' id='password' className='border border-gray-300 p-2 rounded-md' />
        <button className='bg-green-600 text-white p-2 rounded-md mt-5'>Login</button>
      </form>
      <div>
        <p className='text-gray-500 mt-5'>
          {"Don't have an account? "}
          <Link to='/signup' className='inline-block text-green-600'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
