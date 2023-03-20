import { SessionContextProvider } from '@supabase/auth-helpers-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';

import { supabase } from './lib/initSupabase';
import { queryClient } from './lib/initReactQuery';
import ErrorProvider from './context/ErrorContext';
import CommandProvider from './context/CommandContext';

import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <CommandProvider>
          <ErrorProvider>
            <App />
          </ErrorProvider>
        </CommandProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  </React.StrictMode>,
);
