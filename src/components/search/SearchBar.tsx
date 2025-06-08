import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, MicOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { searchResources, setQuery, getSuggestions, addRecentSearch } from '@/store/slices/searchSlice';
import { addToSearchHistory } from '@/store/slices/authSlice';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const popularSearches = [
  'React', 'JavaScript', 'Python', 'Machine Learning', 
  'Data Structures', 'Algorithms', 'Node.js', 'TypeScript'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for courses, tutorials, or topics...",
  showSuggestions = true,
}) => {
  const { query, loading, suggestions } = useAppSelector((state) => state.search);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const [localQuery, setLocalQuery] = useState(query);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    dispatch(setQuery(localQuery));
    if (debouncedQuery && showSuggestions) {
      dispatch(getSuggestions(debouncedQuery));
      setShowSuggestionsList(suggestions.length > 0 && debouncedQuery.length > 0);
    } else {
      setShowSuggestionsList(false);
    }
  }, [debouncedQuery, dispatch, showSuggestions, suggestions.length]);

  const handleSearch = useCallback(async (searchQuery: string = localQuery) => {
    if (!searchQuery.trim()) return;
    
    setShowSuggestionsList(false);
    
    // Add to search history
    dispatch(addRecentSearch(searchQuery));
    if (user) {
      dispatch(addToSearchHistory(searchQuery));
    }
    
    // Navigate to search page if not already there
    if (window.location.pathname !== '/search') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    
    await dispatch(searchResources(searchQuery));
    onSearch?.(searchQuery);
  }, [localQuery, dispatch, user, navigate, onSearch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try typing your search instead.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setLocalQuery(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          toast({
            title: "No Speech Detected",
            description: "No speech was detected. Please try again and speak clearly into your microphone.",
            variant: "destructive",
          });
          break;
        case 'audio-capture':
          toast({
            title: "Microphone Access Error",
            description: "Unable to access your microphone. Please check your microphone permissions.",
            variant: "destructive",
          });
          break;
        case 'not-allowed':
          toast({
            title: "Permission Denied",
            description: "Microphone access was denied. Please allow microphone access to use voice search.",
            variant: "destructive",
          });
          break;
        case 'network':
          toast({
            title: "Network Error",
            description: "A network error occurred during speech recognition. Please check your connection and try again.",
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "Speech Recognition Error",
            description: "An error occurred during speech recognition. Please try again or use text search instead.",
            variant: "destructive",
          });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestionsList(false)
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestionsList(suggestions.length > 0 && localQuery.length > 0)}
            placeholder={placeholder}
            className="pl-10 pr-20 h-12 text-base bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 focus:bg-white/70 dark:focus:bg-gray-700/70"
          />
          <div className="absolute right-2 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={startVoiceSearch}
              disabled={isListening}
              className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => handleSearch()}
              disabled={loading || !localQuery.trim()}
              size="sm"
              className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestionsList && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-white/50 dark:hover:bg-gray-800/50 text-sm backdrop-blur-sm"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Popular Searches */}
      {!localQuery && showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.slice(0, 6).map((search, index) => (
              <motion.div
                key={search}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  onClick={() => handleSuggestionClick(search)}
                >
                  {search}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Extend Window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}