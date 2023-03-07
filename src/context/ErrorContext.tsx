import { createContext, ReactNode, useContext, useState } from 'react';
import { toErrorWithMessage } from '../helper/errorHandler';

interface IErrorContext {
  message: string | null;
  setError: React.Dispatch<unknown>;
}

const ErrorContext = createContext<IErrorContext>({ message: null, setError: () => null });

export default function ErrorProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [error, setError] = useState<unknown>();

  const message = error !== null ? toErrorWithMessage(error).message : null;
  const context = { message, setError };

  return <ErrorContext.Provider value={context}>{children}</ErrorContext.Provider>;
}

export function useError() {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }

  return context;
}
