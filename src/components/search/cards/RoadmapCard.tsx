import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addBookmark, removeBookmark } from '@/store/slices/bookmarkSlice';
import { SearchResult } from '@/types';
import { Map, Clock, ExternalLink, Heart, User, Target, Star, Users } from 'lucide-react';

interface RoadmapCardProps {
  result: SearchResult;
  index: number;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ result, index }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { bookmarks } = useAppSelector((state) => state.bookmarks);
  const dispatch = useAppDispatch();
  
  const isBookmarked = bookmarks.some(bookmark => bookmark.id === result.id);

  const handleBookmark = () => {
    if (!user) return;
    
    if (isBookmarked) {
      dispatch(removeBookmark({ userId: user.uid, resourceId: result.id }));
    } else {
      dispatch(addBookmark({ userId: user.uid, resource: result }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Map className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight hover:text-indigo-600 transition-colors line-clamp-2">
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
              disabled={!user}
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
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                <span className="font-medium">Learning Path:</span> {result.aiSummary}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              {result.metadata.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{result.metadata.rating}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>15K+ learners</span>
              </div>
            </div>
          </div>

          {/* Progress bar for enrolled users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">0%</span>
            </div>
            <Progress value={0} className="h-2 bg-white/50 dark:bg-gray-700/50" />
          </div>

          <div className="flex flex-wrap gap-2">
            {result.metadata.difficulty && (
              <Badge variant="outline\" className={`text-xs ${getDifficultyColor(result.metadata.difficulty)}`}>
                {result.metadata.difficulty}
              </Badge>
            )}
            {result.metadata.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20"
              onClick={() => window.open(result.url, '_blank')}
            >
              <Target className="h-4 w-4" />
              <span>Start Learning</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(result.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};