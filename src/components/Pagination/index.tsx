import classNames from 'classnames';

export interface IPaginationProps {
  page: number;
  totalPages: number;
  className?: string;
}

export default function Pagination(props: IPaginationProps) {
  const { page, totalPages, className } = props;

  const defaultClassName = 'flex items-center text-xs mt-2 text-gray-600';

  return (
    <section className={classNames(defaultClassName, className)}>
      <span className='flex items-center justify-center rounded-full bg-green-200 w-4 h-4 mr-1'>
        {page + 1}
      </span>{' '}
      <span>of {totalPages}</span>
    </section>
  );
}
