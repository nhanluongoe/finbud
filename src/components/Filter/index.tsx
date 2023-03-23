import classNames from 'classnames';
import DateFilter from './DateFilter';

export interface IFilterProps {
  date?: {
    month: number;
    year: number;
  };
  className?: string;
}

export default function Filter(props: IFilterProps) {
  const { className, date } = props;

  const defaultClassNames = 'flex items-center';

  return (
    <section className={classNames(defaultClassNames, className)}>
      {date && <DateFilter month={date.month} year={date.year} />}
    </section>
  );
}
