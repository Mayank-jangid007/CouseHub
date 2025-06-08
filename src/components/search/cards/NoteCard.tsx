import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { SearchResult } from '@/types';
import { FileText, Download, ExternalLink, Heart, User } from 'lucide-react';

interface NoteCardProps {
  result: SearchResult;
  index: number;
}

export const NoteCard: React.FC<NoteCardProps> = ({ result, index }) => {
  const { user, addBookmark, removeBookmark } = useAuth();
  const isBookmarked = user?.bookmarks.includes(result.id) || false;

  const handleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(result.id);
    } else {
      addBookmark(result.id);
    }
  };

  const handleDownload = () => {
    if (result.metadata.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.metadata.downloadUrl;
      link.download = result.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight hover:text-purple-600 transition-colors line-clamp-2">
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
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <span className="font-medium">Preview:</span> {result.aiSummary}
              </p>
            </div>
          )}

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
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            {result.url !== result.metadata.downloadUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(result.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};