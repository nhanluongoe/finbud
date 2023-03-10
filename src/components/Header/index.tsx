import useProfile from '../../hooks/useProfile';
import {
  FaRegDizzy,
  FaRegGrinBeamSweat,
  FaRegGrinBeam,
  FaRegGrinHearts,
  FaRegGrinSquintTears,
  FaRegGrinSquint,
  FaRegGrinStars,
  FaRegGrinTears,
  FaRegGrinTongueSquint,
  FaRegGrinTongueWink,
  FaRegGrinTongue,
  FaRegGrinWink,
  FaRegGrin,
  FaRegGrimace,
  FaRegGrinAlt,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

const faceIcons: IconType[] = [
  FaRegGrimace,
  FaRegDizzy,
  FaRegGrinAlt,
  FaRegGrinBeamSweat,
  FaRegGrinBeam,
  FaRegGrinHearts,
  FaRegGrinSquintTears,
  FaRegGrinSquint,
  FaRegGrinStars,
  FaRegGrinTears,
  FaRegGrinTongueSquint,
  FaRegGrinTongueWink,
  FaRegGrinTongue,
  FaRegGrinWink,
  FaRegGrin,
];

export default function Header() {
  const { firstName, lastName } = useProfile();

  const randomIconIndex = Math.floor(Math.random() * (faceIcons.length - 1));
  const Icon = faceIcons[randomIconIndex];

  return (
    <header className='mb-6'>
      <div className='flex items-center justify-between'>
        <section className='flex items-center w-12 h-12'>
          <img src='/finbud.png' alt='logo' />
          <p className='font-bold text-green-600'>Finbud</p>
        </section>
        <p className='text-green-600'>{` Hi, ${firstName} ${lastName}`}</p>
      </div>
    </header>
  );
}
