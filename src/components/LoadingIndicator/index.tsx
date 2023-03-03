import { useIsFetching } from '@tanstack/react-query';

import style from './index.module.css';

export default function LoadingIndicator() {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return <div className={style.dots} />;
}
