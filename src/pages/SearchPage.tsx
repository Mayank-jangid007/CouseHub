import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { SearchBar } from '@/components/search/SearchBar';
import { ResultsPanel } from '@/components/search/ResultsPanel';
import { useSearch } from '@/contexts/SearchContext';
import { SearchProvider } from '@/contexts/SearchContext';

export const SearchPage: React.FC = () => {
  const searchContext = useSearch();
  const location = useLocation();

  // Show an error if SearchContext is not available
  if (!searchContext) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Search context is not available. Please wrap your app in &lt;SearchProvider&gt;.
      </div>
    );
  }

  const { search } = searchContext;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      search(query);
    }
  }, [location.search, search]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} // Added transition for smoother animation
          className="w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Search Learning Resources
            </h1>
            <p className="text-muted-foreground mb-8">
              Find the best tutorials, documentation, and learning materials across the web.
            </p>

            <SearchBar />
          </div>

          <ResultsPanel />
        </motion.div>
      </div>
    </div>
  );
};