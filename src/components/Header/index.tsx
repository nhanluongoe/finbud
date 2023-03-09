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
    <header className='my-5'>
      <div className='flex items-center justify-between'>
        <section className='flex items-center w-12 h-12'>
          <img src='/logo.png' alt='logo' />
          <p className='font-bold'>Finbud</p>
        </section>
        <section className='flex items-center'>
          <i className='mr-2'>
            <Icon />
          </i>
          <p>{`${firstName} ${lastName}`}</p>
        </section>
      </div>
    </header>
  );
}
