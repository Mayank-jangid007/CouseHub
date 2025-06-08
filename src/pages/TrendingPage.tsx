import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchBar } from '@/components/search/SearchBar';
import { TrendingUp, Siren as Fire, Star, Eye, Clock, Users, Github, Youtube, FileText, BookOpen, ArrowUpRight, Calendar, Award } from 'lucide-react';

interface TrendingItem {
  id: string;
  title: string;
  description: string;
  type: 'github' | 'youtube' | 'blog' | 'notes';
  url: string;
  metadata: {
    author: string;
    stars?: number;
    views?: number;
    duration?: string;
    readTime?: string;
    tags: string[];
    trending_score: number;
    growth_rate: string;
  };
  thumbnail?: string;
}

interface TrendingStats {
  totalSearches: number;
  activeUsers: number;
  newResources: number;
  topCategory: string;
}

const mockTrendingData: TrendingItem[] = [
  {
    id: '1',
    title: 'Next.js 14 App Router Complete Guide',
    description: 'Master the new App Router in Next.js 14 with server components, streaming, and advanced patterns.',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=example1',
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
    metadata: {
      author: 'Vercel',
      views: 125000,
      duration: '2:45:30',
      tags: ['nextjs', 'react', 'app-router', 'server-components'],
      trending_score: 98,
      growth_rate: '+245%'
    }
  },
  {
    id: '2',
    title: 'shadcn/ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
    type: 'github',
    url: 'https://github.com/shadcn-ui/ui',
    metadata: {
      author: 'shadcn',
      stars: 45000,
      tags: ['react', 'tailwind', 'components', 'ui'],
      trending_score: 95,
      growth_rate: '+180%'
    }
  },
  {
    id: '3',
    title: 'Building AI Applications with OpenAI GPT-4',
    description: 'Complete guide to integrating GPT-4 into your applications with practical examples.',
    type: 'blog',
    url: 'https://example.com/ai-guide',
    metadata: {
      author: 'OpenAI Team',
      readTime: '15 min',
      tags: ['ai', 'gpt-4', 'openai', 'integration'],
      trending_score: 92,
      growth_rate: '+320%'
    }
  },
  {
    id: '4',
    title: 'TypeScript Advanced Patterns Cheat Sheet',
    description: 'Comprehensive reference for advanced TypeScript patterns and utility types.',
    type: 'notes',
    url: '/downloads/typescript-patterns.pdf',
    metadata: {
      author: 'TypeScript Community',
      tags: ['typescript', 'patterns', 'advanced', 'reference'],
      trending_score: 89,
      growth_rate: '+150%'
    }
  },
  {
    id: '5',
    title: 'React Server Components Deep Dive',
    description: 'Understanding React Server Components and their impact on modern web development.',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=example2',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    metadata: {
      author: 'React Team',
      views: 89000,
      duration: '1:32:15',
      tags: ['react', 'server-components', 'rsc', 'performance'],
      trending_score: 87,
      growth_rate: '+200%'
    }
  },
  {
    id: '6',
    title: 'Supabase Complete Authentication Guide',
    description: 'Implement secure authentication with Supabase including social providers and RLS.',
    type: 'blog',
    url: 'https://example.com/supabase-auth',
    metadata: {
      author: 'Supabase',
      readTime: '12 min',
      tags: ['supabase', 'authentication', 'security', 'database'],
      trending_score: 85,
      growth_rate: '+175%'
    }
  }
];

const mockStats: TrendingStats = {
  totalSearches: 1250000,
  activeUsers: 45000,
  newResources: 1200,
  topCategory: 'React'
};

const topCategories = [
  { name: 'React', searches: 125000, growth: '+25%' },
  { name: 'Python', searches: 98000, growth: '+18%' },
  { name: 'JavaScript', searches: 87000, growth: '+22%' },
  { name: 'Machine Learning', searches: 76000, growth: '+45%' },
  { name: 'TypeScript', searches: 65000, growth: '+30%' },
  { name: 'Node.js', searches: 54000, growth: '+15%' }
];

export const TrendingPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [selectedType, setSelectedType] = useState<'all' | 'github' | 'youtube' | 'blog' | 'notes'>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'github': return <Github className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'notes': return <BookOpen className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'github': return 'border-l-blue-500';
      case 'youtube': return 'border-l-red-500';
      case 'blog': return 'border-l-green-500';
      case 'notes': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  const filteredData = selectedType === 'all' 
    ? mockTrendingData 
    : mockTrendingData.filter(item => item.type === selectedType);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Fire className="h-8 w-8 text-orange-500 mr-2" />
            <h1 className="text-4xl font-bold">Trending Now</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Discover the hottest learning resources and trending topics
          </p>
          <SearchBar placeholder="Search trending topics..." />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Searches</p>
                  <p className="text-2xl font-bold">{mockStats.totalSearches.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{mockStats.activeUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Resources</p>
                  <p className="text-2xl font-bold">{mockStats.newResources.toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                  <p className="text-2xl font-bold">{mockStats.topCategory}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trending Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Trending Resources</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {filteredData.length} resources
                  </Badge>
                </div>
              </div>

              <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="github">GitHub</TabsTrigger>
                  <TabsTrigger value="youtube">Videos</TabsTrigger>
                  <TabsTrigger value="blog">Blogs</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedType}>
                  <div className="space-y-4">
                    {filteredData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${getTypeColor(item.type)}`}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                {item.thumbnail && (
                                  <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-16 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {getTypeIcon(item.type)}
                                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                                    <Badge variant="outline" className="text-xs">
                                      #{index + 1}
                                    </Badge>
                                  </div>
                                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                    {item.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                    <span>by {item.metadata.author}</span>
                                    {item.metadata.stars && (
                                      <div className="flex items-center space-x-1">
                                        <Star className="h-3 w-3" />
                                        <span>{item.metadata.stars.toLocaleString()}</span>
                                      </div>
                                    )}
                                    {item.metadata.views && (
                                      <div className="flex items-center space-x-1">
                                        <Eye className="h-3 w-3" />
                                        <span>{item.metadata.views.toLocaleString()}</span>
                                      </div>
                                    )}
                                    {item.metadata.duration && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{item.metadata.duration}</span>
                                      </div>
                                    )}
                                    {item.metadata.readTime && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{item.metadata.readTime}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {item.metadata.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <div className="flex items-center space-x-2">
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                  <span className="text-sm font-medium text-green-500">
                                    {item.metadata.growth_rate}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  Score: {item.metadata.trending_score}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(item.url, '_blank')}
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Top Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.searches.toLocaleString()} searches
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {category.growth}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Time Period Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Time Period</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {(['today', 'week', 'month'] as const).map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className="capitalize"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View All Trending
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Most Bookmarked
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Recently Added
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};