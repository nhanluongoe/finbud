import { createContext, ReactNode, useContext, useState } from 'react';
import { toErrorWithMessage } from '../helper/errorHandler';

interface IErrorContext {
  message: string | null;
}

interface ISetErrorContext {
  setError: React.Dispatch<unknown>;
}

const ErrorContext = createContext<IErrorContext>({ message: null });
const SetErrorContext = createContext<ISetErrorContext>({ setError: () => null });

export default function ErrorProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [error, setError] = useState<unknown>();

  const message = error !== null ? toErrorWithMessage(error).message : null;

  return (
    <SetErrorContext.Provider value={{ setError }}>
      <ErrorContext.Provider value={{ message }}>{children}</ErrorContext.Provider>;
    </SetErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }

  return context;
}

export function useSetError() {
  const context = useContext(SetErrorContext);

  if (!context) {
    throw new Error('useSetError must be used within ErrorProvider');
  }

  return context;
}
