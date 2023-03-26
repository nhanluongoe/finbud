import { SessionContextProvider } from '@supabase/auth-helpers-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { supabase } from './lib/initSupabase';
import { queryClient } from './lib/initReactQuery';
import ErrorProvider from './context/ErrorContext';
import CommandProvider from './context/CommandContext';
import Home from './pages/Home';

import './styles/index.css';
import Login from './pages/Login';
import Signup from './pages/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <CommandProvider>
          <ErrorProvider>
            <RouterProvider router={router} />
          </ErrorProvider>
        </CommandProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  </React.StrictMode>,
);
