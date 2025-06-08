import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SearchProvider } from '@/contexts/SearchContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchProvider>
      <App />
    </SearchProvider>
  </StrictMode>
);
