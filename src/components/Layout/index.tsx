import { ReactNode } from 'react';

import Header from '../Header';
import Footer from '../Footer';
import LoadingIndicator from '../LoadingIndicator';

interface ILayout {
  children: ReactNode;
}
export default function Layout(props: ILayout) {
  const { children } = props;

  return (
    <div className='container mx-auto px-4 relative'>
      <section className='absolute right-0 top-0'>
        <LoadingIndicator />
      </section>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
