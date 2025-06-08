import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setFilter } from '@/store/slices/searchSlice';
import { SearchResult } from '@/types';
import { RepoCard } from './cards/RepoCard';
import { VideoCard } from './cards/VideoCard';
import { BlogCard } from './cards/BlogCard';
import { NoteCard } from './cards/NoteCard';
import { RoadmapCard } from './cards/RoadmapCard';
import { Github, Youtube, FileText, BookOpen, Filter, SortDesc, Map } from 'lucide-react';

export const ResultsPanel: React.FC = () => {
  const { results, loading, error, filters } = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();

  const filterResults = (type: string): SearchResult[] => {
    if (type === 'all') return results;
    return results.filter(result => result.type === type);
  };

  const sortResults = (results: SearchResult[]): SearchResult[] => {
    switch (filters.sortBy) {
      case 'date':
        return [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popularity':
        return [...results].sort((a, b) => (b.metadata.stars || b.metadata.views || 0) - (a.metadata.stars || a.metadata.views || 0));
      default:
        return results;
    }
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'github': return <Github className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'notes': return <BookOpen className="h-4 w-4" />;
      case 'roadmap': return <Map className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTabCount = (type: string): number => {
    return type === 'all' ? results.length : results.filter(r => r.type === type).length;
  };

  const renderCard = (result: SearchResult, index: number) => {
    const baseProps = { result, index };
    
    switch (result.type) {
      case 'github':
        return <RepoCard key={result.id} {...baseProps} />;
      case 'youtube':
        return <VideoCard key={result.id} {...baseProps} />;
      case 'blog':
        return <BlogCard key={result.id} {...baseProps} />;
      case 'notes':
        return <NoteCard key={result.id} {...baseProps} />;
      case 'roadmap':
        return <RoadmapCard key={result.id} {...baseProps} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="h-48 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-lg animate-pulse border border-white/20"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-lg p-6">
          <div className="text-red-500 text-lg mb-2">Search Error</div>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Search Results</h2>
          <Badge variant="secondary" className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20">
            {results.length} results found
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => dispatch(setFilter({ key: 'sortBy', value }))}
          >
            <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20">
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs 
        value={filters.type} 
        onValueChange={(value) => dispatch(setFilter({ key: 'type', value }))}
        className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-lg border border-white/20 p-6"
      >
        <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>All</span>
            <Badge variant="secondary" className="ml-1 bg-white/50 dark:bg-gray-700/50">{getTabCount('all')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center space-x-2">
            {getTabIcon('github')}
            <span>GitHub</span>
            <Badge variant="secondary" className="ml-1 bg-white/50 dark:bg-gray-700/50">{getTabCount('github')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center space-x-2">
            {getTabIcon('youtube')}
            <span>Videos</span>
            <Badge variant="secondary" className="ml-1 bg-white/50 dark:bg-gray-700/50">{getTabCount('youtube')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center space-x-2">
            {getTabIcon('blog')}
            <span>Blogs</span>
            <Badge variant="secondary" className="ml-1 bg-white/50 dark:bg-gray-700/50">{getTabCount('blog')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center space-x-2">
            {getTabIcon('notes')}
            <span>Notes</span>
            <Badge variant="secondary" className="ml-1 bg-white/50 dark:bg-gray-700/50">{getTabCount('notes')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center space-x-2">
            {getTabIcon('roadmap')}
            <span>Roadmaps</span>
            <Badge variant="secondary" className="ml-1 bg-white/50 dark:bg-gray-700/50">{getTabCount('roadmap')}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {['all', 'github', 'youtube', 'blog', 'notes', 'roadmap'].map(type => (
            <TabsContent key={type} value={type}>
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {sortResults(filterResults(type)).map((result, index) => renderCard(result, index))}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </motion.div>
  );
};