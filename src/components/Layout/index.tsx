import { ReactNode } from 'react';

import Header from '../Header';
import Footer from '../Footer';
import CommandLine from '../CommandLine';

interface ILayout {
  children: ReactNode;
}
export default function Layout(props: ILayout) {
  const { children } = props;

  return (
    <div className='container mx-auto px-4'>
      <Header />
      {children}
      <CommandLine />
      <Footer />
    </div>
  );
}
