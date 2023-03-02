import { SessionContextProvider } from '@supabase/auth-helpers-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { supabase } from './lib/initSupabase';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>,
);
