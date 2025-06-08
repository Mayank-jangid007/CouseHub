import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { store, persistor } from '@/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';
import { Home } from '@/pages/Home';
import { SearchPage } from '@/pages/SearchPage';
import { TrendingPage } from '@/pages/TrendingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
                <Header />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/trending" element={<TrendingPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Profile Page - Coming Soon</h1></div>} />
                    <Route path="/bookmarks" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Bookmarks Page - Coming Soon</h1></div>} />
                    <Route path="/settings" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Settings Page - Coming Soon</h1></div>} />
                  </Routes>
                </AnimatePresence>
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;