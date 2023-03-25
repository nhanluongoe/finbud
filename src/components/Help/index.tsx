import { useEffect, useState } from 'react';
import { useCommand } from '../../context/CommandContext';

import Modal from '../Modal';

const commands = [
  {
    title: 'Create',
    usage: 'create <target> <params>',
    examples: ['create account name=Vietcombank&balance=1000000', 'c a n=Vietcombank&b=1000000'],
  },
  {
    title: 'Update',
    usage: 'update <target> <target_id> <params>',
    examples: ['update account 1 balance=5000000', 'u a 1 b=5000000'],
  },
  {
    title: 'Delete',
    usage: 'delete <target> <target_id>',
    examples: ['delete account 1', 'd a 1'],
  },
  {
    title: 'Filter',
    usage: 'filter <target> <params>',
    examples: ['filter account month=2&year=2023', 'f a m=2&y=2023'],
  },
  {
    title: 'Pagination',
    usage: 'next|previous <target>',
    examples: ['next account', 'previous account', 'n a', 'p a'],
  },
];

interface ICommandSectionProps {
  title: string;
  usage: string;
  examples: string[];
}

function CommandSection({ title, usage, examples }: ICommandSectionProps) {
  return (
    <section>
      <p className='text-2xl mb-2'>{title}</p>
      <div className='mb-2'>
        <p>Usage:</p>
        <p className='backtick'>{usage}</p>
      </div>
      <div>
        <p>Examples:</p>
        {examples.map((example, index) => (
          <p key={index} className='backtick'>
            {example}
          </p>
        ))}
      </div>
    </section>
  );
}

export default function Help() {
  const [open, setOpen] = useState(false);

  const command = useCommand();

  useEffect(() => {
    const extractedCommand = command.split(' ')[0];

    if (extractedCommand === 'help') {
      setOpen(true);
    }
  }, [command]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className='bg-canvas-50 w-full md:w-3/4 3xl:w-1/2 h-3/4 p-12 rounded-xl text-gray-700 overflow-auto'>
        <p className='text-right text-sm'>
          Press <span className='key'>Esc</span> to close
        </p>
        <h1 className='uppercase text-center text-3xl mb-16'>Quick Help</h1>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-8'>
          {commands.map((command, index) => (
            <CommandSection key={index} {...command} />
          ))}
        </div>
        <div className='divider' />
        <div>
          <p className='mb-5'>
            <span className='backtick'>{'<params>'}</span> is a list of key-value pairs separated by{' '}
            <span className='backtick'>&</span>. For example:{' '}
            <span className='backtick'>
              name=savings<span className='font-bold'>&</span>balance=100000000
            </span>
            .
          </p>
          <p className='mb-5'>
            <span className='backtick'>{'<target>'}</span> is a resource you want to perform an
            action on. They are <span className='backtick'>account</span>,{' '}
            <span className='backtick'>budget</span>, and{' '}
            <span className='backtick'>transaction</span>.
          </p>
          <p className='mb-5'>
            <span className='backtick'>{'<target_id>'}</span> is the id of the resource you want to
            perform an action on. You can get this id by looking at a record.
          </p>
          <p>
            You can always get the abbreviation of a target or a param by looking at a small note
            next to it when inputting a command.
          </p>
        </div>
      </div>
    </Modal>
  );
}
