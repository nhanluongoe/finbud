import classNames from 'classnames';
import { ReactNode } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
export interface IAlertProps {
  variant: 'info';
  message?: ReactNode;
  className?: string;
}

const icons = {
  info: <AiOutlineInfoCircle />,
};

const colors = {
  info: 'bg-blue-50 text-blue-400 border border-blue-200',
};

export default function Alert(props: IAlertProps) {
  const { variant, message, className } = props;

  const defaultClassName = `flex items-center p-2 rounded ${colors[variant]}`;

  return (
    <div className={classNames(defaultClassName, className)}>
      <i className='m-1 text-xl font-bold'>{icons[variant]}</i>
      {message}
    </div>
  );
}
