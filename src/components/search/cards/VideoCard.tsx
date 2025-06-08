import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { SearchResult } from '@/types';
import { Play, Clock, ExternalLink, Heart, User } from 'lucide-react';

interface VideoCardProps {
  result: SearchResult;
  index: number;
}

export const VideoCard: React.FC<VideoCardProps> = ({ result, index }) => {
  const { user, addBookmark, removeBookmark } = useAuth();
  const isBookmarked = user?.bookmarks.includes(result.id) || false;

  const handleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(result.id);
    } else {
      addBookmark(result.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img
                  src={result.metadata.thumbnail || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={result.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight hover:text-red-600 transition-colors line-clamp-2">
                  {result.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {result.metadata.author}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="h-8 w-8 p-0"
            >
              <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {result.description}
          </p>

          {result.aiSummary && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-medium">Key Points:</span> {result.aiSummary}
              </p>
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {result.metadata.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{result.metadata.duration}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {result.metadata.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => window.open(result.url, '_blank')}
            >
              <Play className="h-4 w-4" />
              <span>Watch Video</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};