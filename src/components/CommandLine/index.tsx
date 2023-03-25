import { IoIosArrowForward } from 'react-icons/io';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import useEventListener from '../../hooks/useEventLister';
import { useSetError } from '../../context/ErrorContext';
import { supabase } from '../../lib/initSupabase';
import { useCommandHistory } from '../../context/CommandHistoryContext';
import { useSetCommand } from '../../context/CommandContext';
import { useQueryClient } from '@tanstack/react-query';
import { isCommandValid } from '../../helper';


export default function CommandLine() {
  const setCommand = useSetCommand();
  const { history, setHistory } = useCommandHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const { setError } = useSetError();
  const queryClient = useQueryClient();

  queryClient.setDefaultOptions({
    queries: {
      staleTime: Infinity,
    },
    mutations: {
      onError: (err) => {
        setError(err);
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eventTarget = e.target as typeof e.target & {
      command: { value: string };
    };
    const command = eventTarget.command.value;

    if (command === '') {
      setError(null);
      hideInput();
      return;
    }

    // Add command to history
    setHistory?.((history) => [...history, command]);

    if (!isCommandValid(command)) {
      setError('Invalid command!');
      hideInput();
      return;
    }

    // add uuid to make command unique even if user enters...
    // the same command consecutively to make useEffect that...
    // have command as depenency always run on each command
    setCommand(command + ` &uuid=${uuidv4()}`);

    const inputSplits = command.split(' ');
    const action = inputSplits[0].toLowerCase();

    switch (action) {
      // Auth
      case 'lo':
      case 'logout': {
        await supabase.auth.signOut();
        break;
      }
      default:
        break;
    }

    hideInput();
  };

  const hideInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setVisible(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const focusInput = (e: any) => {
    const isInputActive = inputRef.current === document.activeElement;

    if (e.key === 'Escape') {
      hideInput();
    }

    if (!isInputActive) {
      switch (e.key) {
        case 'i': {
          setVisible(true);

          if (!inputRef.current) return;

          inputRef.current.value = '';
          inputRef.current.focus();
          break;
        }
      }
    }
  };

  useEventListener('keyup', focusInput);

  /*
   * Use up arrow or down arrow to retrive command history
   * */
  const historyCount = useRef<number>(-1);
  const retrieveHistory = (e: any) => {
    const isInputActive = inputRef.current === document.activeElement;

    if (!isInputActive) return;

    if (!inputRef.current) return;

    const historyLength = history.length;

    if (historyLength === 0) return;

    switch (e.key) {
      case 'ArrowUp': {
        if (historyCount.current < historyLength - 1) {
          historyCount.current++;
        }
        const previousCommand = history[historyLength - 1 - historyCount.current];

        inputRef.current.value = previousCommand;
        break;
      }
      case 'ArrowDown': {
        if (historyCount.current > 0) {
          historyCount.current--;
        }

        if (historyCount.current < 0) return;

        const nextCommand = history[historyLength - 1 - historyCount.current];

        inputRef.current.value = nextCommand;
        break;
      }
      default: {
        historyCount.current = -1;
      }
    }
  };

  useEventListener('keyup', retrieveHistory);

  if (!visible) {
    return null;
  }

  return (
    <div className='fixed block w-full h-full top-0 left-0 right-0 bottom-0'>
      <div className='flex justify-start items-end w-full h-full pb-7 px-5'>
        <form onSubmit={handleSubmit} className='w-full'>
          <p className='text-gray-500 mb-1'>
            Type &quot;help&quot; to show a quick introduction about the commands!
          </p>
          <div className='flex items-center w-full  rounded-md border-green-600 border py-1 px-2 bg-canvas-50'>
            <span className='text-green-600'>
              <IoIosArrowForward />
            </span>
            <input
              className='text-gray-600 w-full'
              name='command'
              ref={inputRef}
              autoComplete='off'
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
}
