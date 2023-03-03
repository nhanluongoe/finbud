import { useEffect, useRef } from 'react';

export default function useEventListener(
  eventName: string,
  handler: (e: any) => void,
  element = window,
) {
  const memoizedHandler = useRef<(e: any) => void>();

  useEffect(() => {
    memoizedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: any) => memoizedHandler.current?.(event);

    document.addEventListener(eventName, eventListener);

    return () => document.removeEventListener(eventName, eventListener);
  }, [eventName, element]);
}
