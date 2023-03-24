import classNames from 'classnames';
import { ReactNode } from 'react';

export interface IEmptyProps {
  message?: string;
  content?: ReactNode;
  className?: string;
}

export default function Empty(props: IEmptyProps) {
  const { message = 'No Data', content, className } = props;

  const defaultClassName = 'flex flex-col items-center justify-center h-full p-4 m-4';

  return (
    <section className={classNames(defaultClassName, className)}>
      <img src='/empty-box.png' alt='empty' className='object-contain w-24 h-24' />
      <p className='text-slate-500'>{message}</p>
      <div>{content}</div>
    </section>
  );
}
