import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SearchResult } from '@/types';
import { searchAPI } from '@/lib/api';

interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  filters: {
    type: 'all' | 'github' | 'youtube' | 'blog' | 'notes' | 'roadmap';
    sortBy: 'relevance' | 'date' | 'popularity';
    difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  };
  suggestions: string[];
  recentSearches: string[];
}

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
  suggestions: [],
  recentSearches: [],
};

export const searchResources = createAsyncThunk(
  'search/searchResources',
  async (query: string) => {
    const results = await searchAPI.searchAll(query);
    return { query, results };
  }
);

export const searchByType = createAsyncThunk(
  'search/searchByType',
  async ({ query, type }: { query: string; type: string }) => {
    let results: SearchResult[] = [];
    
    switch (type) {
      case 'github':
        results = await searchAPI.searchGithub(query);
        break;
      case 'youtube':
        results = await searchAPI.searchYouTube(query);
        break;
      case 'blog':
        results = await searchAPI.searchBlogs(query);
        break;
      case 'notes':
        results = await searchAPI.searchNotes(query);
        break;
      case 'roadmap':
        results = await searchAPI.searchRoadmaps(query);
        break;
      default:
        results = await searchAPI.searchAll(query);
    }
    
    return results;
  }
);

export const getSuggestions = createAsyncThunk(
  'search/getSuggestions',
  async (query: string) => {
    const suggestions = await searchAPI.getSuggestions(query);
    return suggestions;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: keyof SearchState['filters']; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    clearResults: (state) => {
      state.results = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      state.recentSearches = [query, ...state.recentSearches.filter(q => q !== query)].slice(0, 10);
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search resources
      .addCase(searchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload.query;
        state.results = action.payload.results;
        state.error = null;
      })
      .addCase(searchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      // Search by type
      .addCase(searchByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByType.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(searchByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      // Get suggestions
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const { 
  setQuery, 
  setFilter, 
  clearResults, 
  clearError, 
  addRecentSearch, 
  setSuggestions 
} = searchSlice.actions;
export default searchSlice.reducer;