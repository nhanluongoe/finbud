import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wobbling } from '../components/LoadingIndicator';
import { supabase } from '../lib/initSupabase';

export default function Signup() {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    const confirmPassword = e.currentTarget['confirm-password'].value;

    console.log(email, password, confirmPassword);

    if (!email || !password || !confirmPassword) {
      setError('Please fill all fields!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password does not match!');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

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
        <h1 className='text-4xl font-bold my-5'>Sign up</h1>
        <p className='text-gray-500'>Sign up and ready to rock!</p>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
      <form className='flex flex-col w-1/2 xl:w-1/3 mt-10' onSubmit={handleSignup}>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' className='border border-gray-300 p-2 rounded-md' />
        <label htmlFor='password' className='mt-5'>
          Password
        </label>
        <input type='password' id='password' className='border border-gray-300 p-2 rounded-md' />
        <label htmlFor='confirm-password' className='mt-5'>
          Confirm Password
        </label>
        <input
          type='password'
          id='confirm-password'
          className='border border-gray-300 p-2 rounded-md'
        />
        <button className='bg-green-600 text-white p-2 rounded-md mt-5'>Sign up</button>
      </form>
      <div>
        <p className='text-gray-500 mt-5'>
          {'Already have an account? '}
          <Link to='/login' className='inline-block text-green-600'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
