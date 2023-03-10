import { ReactNode } from 'react';

import Header from '../Header';
import LoadingIndicator from '../LoadingIndicator';

interface ILayout {
  children: ReactNode;
}
export default function Layout(props: ILayout) {
  const { children } = props;

  return (
    <div className='container mx-auto px-4 relative'>
      <section className='absolute top-0 left-1/2 -translate-x-1/2'>
        <LoadingIndicator />
      </section>
      <Header />
      {children}
    </div>
  );
}
