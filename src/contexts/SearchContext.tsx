import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react';
import { SearchState, SearchResult } from '@/types';
import { searchAPI } from '@/lib/api';

// Define the shape of the context
interface SearchContextType extends SearchState {
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  setFilter: (type: SearchState['filters']['type']) => void;
  setSortBy: (sortBy: SearchState['filters']['sortBy']) => void;
  clearResults: () => void;
}

// Create the context
const SearchContext = createContext<SearchContextType | null>(null);

// Define possible actions
type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: SearchResult[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTER'; payload: SearchState['filters']['type'] }
  | { type: 'SET_SORT_BY'; payload: SearchState['filters']['sortBy'] }
  | { type: 'CLEAR_RESULTS' };

// Reducer function
const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, type: action.payload } };
    case 'SET_SORT_BY':
      return { ...state, filters: { ...state.filters, sortBy: action.payload } };
    case 'CLEAR_RESULTS':
      return { ...state, results: [], error: null };
    default:
      return state;
  }
};

// Initial state
const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  filters: {
    type: 'all',
    sortBy: 'relevance',
    difficulty: 'all',
  },
};

// Provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setQuery = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  };

  const search = async (query: string) => {
    if (!query.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const results = await searchAPI.searchAll(query);
      dispatch({ type: 'SET_RESULTS', payload: results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search resources' });
    }
  };

  const setFilter = (type: SearchState['filters']['type']) => {
    dispatch({ type: 'SET_FILTER', payload: type });
  };

  const setSortBy = (sortBy: SearchState['filters']['sortBy']) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  };

  const clearResults = () => {
    dispatch({ type: 'CLEAR_RESULTS' });
  };

  const value: SearchContextType = {
    ...state,
    setQuery,
    search,
    setFilter,
    setSortBy,
    clearResults,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook for consuming the context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
