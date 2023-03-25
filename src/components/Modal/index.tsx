import { useEffect } from 'react';
import Portal from '../Portal';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

export interface IModalProps {
  open: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function Modal(props: IModalProps) {
  const { open, children, onClose, className } = props;

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    }

    document.addEventListener('keydown', handleEsc);

    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!open) return null;

  const defaultClassName = 'modal';

  return (
    <Portal wrapperId={`modal-${uuidv4()}`}>
      <div className={classNames(className, defaultClassName)}>{children}</div>
    </Portal>
  );
}
