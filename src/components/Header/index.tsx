import useProfile from '../../hooks/useProfile';

export default function Header() {
  const { firstName, lastName, email } = useProfile();

  const userName = `${firstName} ${lastName}`;

  return (
    <header className='mb-6'>
      <div className='flex items-center justify-between'>
        <section className='flex items-center w-12 h-12'>
          <img src='/finbud.png' alt='logo' />
          <p className='font-bold text-green-600'>Finbud</p>
        </section>
        <p className='text-green-600'>{` 👋 ${userName != ' ' ? userName : email}`}</p>
      </div>
    </header>
  );
}
