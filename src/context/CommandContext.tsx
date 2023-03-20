import { createContext, ReactNode, useContext, useState } from 'react';

interface ICommandContext {
  command: string;
}

const CommandContext = createContext<ICommandContext>({
  command: '',
});

interface ISetCommandContext {
  setCommand: React.Dispatch<React.SetStateAction<string>>;
}

const SetCommandContext = createContext<ISetCommandContext>({
  setCommand: () => null,
});

export default function CommandProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [command, setCommand] = useState<string>('');

  // use two context here to reduce re-renders of consumsers in case ...
  // a consumer only need "command" or "setCommand"
  return (
    <SetCommandContext.Provider value={{ setCommand }}>
      <CommandContext.Provider value={{ command }}>{children}</CommandContext.Provider>
    </SetCommandContext.Provider>
  );
}

export function useCommand() {
  const { command } = useContext(CommandContext);

  if (command == null) {
    throw new Error('useCommand must be used within CommandProvider');
  }

  return command;
}

export function useSetCommand() {
  const { setCommand } = useContext(SetCommandContext);

  if (!setCommand) {
    throw new Error('useSetCommand must be used within CommandProvider');
  }

  return setCommand;
}
