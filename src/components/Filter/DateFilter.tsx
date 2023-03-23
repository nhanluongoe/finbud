import classNames from 'classnames';
import { BsCalendar3 } from 'react-icons/bs';

export interface IDateFilterProps {
  month: number;
  year: number;
  className?: string;
}

export default function DateFilter(props: IDateFilterProps) {
  const { month, year, className } = props;

  const defaultClassNames = '';

  return (
    <div className={classNames(className, defaultClassNames)}>
      <div className='chip flex items-center'>
        <i className='inline-block mr-2'>
          <BsCalendar3 />
        </i>
        <span>{month}</span>/<span>{year}</span>
      </div>
    </div>
  );
}
