import { useError } from '../../context/ErrorContext';

export default function CommandError() {
  const { message } = useError();

  if (!message) return null;

  return (
    <div className='fixed bottom-0 left-0 w-max ml-5'>
      <p className='text-red-500 font-bold'>Error: {message}</p>
    </div>
  );
}
