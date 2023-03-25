import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface IPortalProps {
  children: React.ReactNode;
  wrapperId: string;
}

function createWrapper(wrapperId: string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);

  return wrapperElement;
}

export default function Portal(props: IPortalProps) {
  const { children, wrapperId = 'porta-id' } = props;

  const [wrapper, setWrapper] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let isElementCreated = false;

    if (!element) {
      element = createWrapper(wrapperId);
      isElementCreated = true;
    }

    setWrapper(element);

    return () => {
      if (!element) return;

      if (isElementCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (!wrapper) return null;

  return createPortal(children, wrapper);
}
