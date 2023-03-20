import { createContext, ReactNode, useContext, useState } from 'react';

interface ICommandHistoryContext {
  history: string[];
  setHistory?: React.Dispatch<React.SetStateAction<string[]>>;
}

const CommandHistoryContext = createContext<ICommandHistoryContext>({
  history: [],
  setHistory: () => null,
});

export default function CommandHistoryProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [history, setHistory] = useState<string[]>([]);

  const context = {
    history,
    setHistory,
  };

  return (
    <CommandHistoryContext.Provider value={context}>{children}</CommandHistoryContext.Provider>
  );
}

export function useCommandHistory() {
  const context = useContext(CommandHistoryContext);

  if (!context) {
    throw new Error('useCommandHistory must be used within CommandHistoryProvider');
  }

  return context;
}
