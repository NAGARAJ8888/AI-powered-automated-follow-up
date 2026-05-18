import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setupListeners } from '@reduxjs/toolkit/query';
import './index.css';
import { store } from './app/store';
import App from './App.jsx';

// Enable refetchOnFocus and refetchOnReconnect for all RTK Query endpoints
setupListeners(store.dispatch);

// Apply theme class before React renders to prevent flicker.
const STORAGE_KEY = 'themePreference';
const stored = window.localStorage.getItem(STORAGE_KEY);
const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
const initialMode = stored ? stored : (systemPrefersDark ? 'dark' : 'light');

document.documentElement.classList.toggle('dark', initialMode === 'dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
