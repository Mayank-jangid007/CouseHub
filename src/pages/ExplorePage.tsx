import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchBar } from '@/components/search/SearchBar';
import { 
  Compass, 
  Star, 
  BookOpen, 
  Code, 
  Palette, 
  Database, 
  Brain, 
  Smartphone,
  Globe,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Play,
  Download,
  ExternalLink,
  Heart,
  Eye,
  Github,
  Youtube,
  FileText,
  Award,
  Target,
  Lightbulb,
  Rocket,
  GraduationCap,
  Code2,
  Cpu,
  PaintBucket,
  Server,
  Lock,
  Layers
} from 'lucide-react';

interface ExploreCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  resourceCount: number;
  trending: boolean;
  subcategories: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

interface FeaturedResource {
  id: string;
  title: string;
  description: string;
  type: 'github' | 'youtube' | 'blog' | 'notes';
  url: string;
  author: string;
  thumbnail?: string;
  stats: {
    stars?: number;
    views?: number;
    downloads?: number;
    rating: number;
  };
  tags: string[];
  featured: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: number;
  completedBy: number;
  tags: string[];
  thumbnail: string;
}

const exploreCategories: ExploreCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    description: 'Build beautiful and interactive user interfaces',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    resourceCount: 1250,
    trending: true,
    subcategories: ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'JavaScript'],
    difficulty: 'All Levels'
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'Server-side programming and API development',
    icon: Server,
    color: 'from-green-500 to-emerald-500',
    resourceCount: 980,
    trending: false,
    subcategories: ['Node.js', 'Python', 'Java', 'Go', 'Databases'],
    difficulty: 'All Levels'
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    description: 'Create apps for iOS and Android platforms',
    icon: Smartphone,
    color: 'from-purple-500 to-pink-500',
    resourceCount: 750,
    trending: true,
    subcategories: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic'],
    difficulty: 'Intermediate'
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Artificial intelligence and data science',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    resourceCount: 890,
    trending: true,
    subcategories: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'NLP'],
    difficulty: 'Advanced'
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    description: 'Deployment, monitoring, and infrastructure',
    icon: Layers,
    color: 'from-indigo-500 to-purple-500',
    resourceCount: 650,
    trending: false,
    subcategories: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
    difficulty: 'Intermediate'
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    description: 'Protect applications and systems',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    resourceCount: 420,
    trending: false,
    subcategories: ['Web Security', 'Network Security', 'Ethical Hacking', 'Cryptography'],
    difficulty: 'Advanced'
  },
  {
    id: 'design',
    name: 'UI/UX Design',
    description: 'User experience and interface design',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    resourceCount: 580,
    trending: true,
    subcategories: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
    difficulty: 'Beginner'
  },
  {
    id: 'data',
    name: 'Data Engineering',
    description: 'Big data processing and analytics',
    icon: Database,
    color: 'from-teal-500 to-green-500',
    resourceCount: 340,
    trending: false,
    subcategories: ['SQL', 'Apache Spark', 'Kafka', 'ETL', 'Data Warehousing'],
    difficulty: 'Advanced'
  }
];

const featuredResources: FeaturedResource[] = [
  {
    id: '1',
    title: 'Complete React Developer Course',
    description: 'Master React from basics to advanced concepts with real-world projects',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=example',
    author: 'React Academy',
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
    stats: { views: 250000, rating: 4.8 },
    tags: ['react', 'javascript', 'frontend'],
    featured: true,
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    title: 'awesome-python',
    description: 'A curated list of awesome Python frameworks, libraries, and resources',
    type: 'github',
    url: 'https://github.com/vinta/awesome-python',
    author: 'Vinta Chen',
    stats: { stars: 180000, rating: 4.9 },
    tags: ['python', 'resources', 'awesome-list'],
    featured: true,
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'Machine Learning Yearning',
    description: 'Technical strategy for AI engineers in the era of deep learning',
    type: 'notes',
    url: '/downloads/ml-yearning.pdf',
    author: 'Andrew Ng',
    stats: { downloads: 50000, rating: 4.7 },
    tags: ['machine-learning', 'ai', 'strategy'],
    featured: true,
    difficulty: 'Advanced'
  },
  {
    id: '4',
    title: 'Building Microservices with Node.js',
    description: 'Learn to design and implement scalable microservices architecture',
    type: 'blog',
    url: 'https://example.com/microservices-guide',
    author: 'Tech Blog',
    stats: { views: 75000, rating: 4.6 },
    tags: ['nodejs', 'microservices', 'architecture'],
    featured: true,
    difficulty: 'Advanced'
  }
];

const learningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Full-Stack Web Developer',
    description: 'Complete path from frontend to backend development',
    duration: '6 months',
    difficulty: 'Beginner',
    steps: 12,
    completedBy: 15000,
    tags: ['html', 'css', 'javascript', 'react', 'nodejs'],
    thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Data Scientist',
    description: 'Master data analysis, machine learning, and statistical modeling',
    duration: '8 months',
    difficulty: 'Intermediate',
    steps: 15,
    completedBy: 8500,
    tags: ['python', 'pandas', 'scikit-learn', 'tensorflow'],
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Mobile App Developer',
    description: 'Build cross-platform mobile applications',
    duration: '5 months',
    difficulty: 'Intermediate',
    steps: 10,
    completedBy: 12000,
    tags: ['react-native', 'flutter', 'mobile', 'ios', 'android'],
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description: 'Learn deployment, monitoring, and infrastructure management',
    duration: '7 months',
    difficulty: 'Advanced',
    steps: 14,
    completedBy: 6500,
    tags: ['docker', 'kubernetes', 'aws', 'cicd'],
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const ExplorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredCategories = exploreCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
                             category.difficulty === selectedDifficulty ||
                             category.difficulty === 'All Levels';
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100/50 text-green-800 dark:bg-green-900/20 dark:text-green-300 backdrop-blur-sm';
      case 'Intermediate': return 'bg-yellow-100/50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 backdrop-blur-sm';
      case 'Advanced': return 'bg-red-100/50 text-red-800 dark:bg-red-900/20 dark:text-red-300 backdrop-blur-sm';
      default: return 'bg-blue-100/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 backdrop-blur-sm';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white/30 to-purple-50/30 dark:from-gray-900/30 dark:via-gray-900/30 dark:to-gray-800/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Compass className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-4xl font-bold">Explore Learning</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Discover curated learning paths, categories, and resources to advance your skills
          </p>
          <SearchBar placeholder="Search categories, topics, or technologies..." />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">5,000+</p>
              <p className="text-sm text-muted-foreground">Resources</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-sm text-muted-foreground">Learners</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">25+</p>
              <p className="text-sm text-muted-foreground">Learning Paths</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-muted-foreground">Certificates</p>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-lg border border-white/20 p-6"
            >
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">Difficulty:</span>
                  </div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Categories Grid */}
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                            <category.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex items-center space-x-2">
                            {category.trending && (
                              <Badge variant="secondary\" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            <Badge variant="outline" className={`text-xs ${getDifficultyColor(category.difficulty)}`}>
                              {category.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {category.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>{category.resourceCount.toLocaleString()} resources</span>
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <Badge key={sub} variant="secondary" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                              {sub}
                            </Badge>
                          ))}
                          {category.subcategories.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                              +{category.subcategories.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Structured Learning Paths</h2>
                <Badge variant="secondary" className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">{learningPaths.length} paths available</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPaths.map((path, index) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={path.thumbnail}
                            alt={path.title}
                            className="w-20 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold">{path.title}</h3>
                              <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                                {path.difficulty}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">
                              {path.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{path.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="h-4 w-4" />
                                <span>{path.steps} steps</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{path.completedBy.toLocaleString()} completed</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {path.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                              <Rocket className="h-4 w-4 mr-2" />
                              Start Learning Path
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Featured Tab */}
          <TabsContent value="featured" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Featured Resources</h2>
                <Badge variant="secondary" className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">{featuredResources.length} featured items</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {resource.type === 'github' && <Github className="h-5 w-5 text-gray-700" />}
                            {resource.type === 'youtube' && <Youtube className="h-5 w-5 text-red-500" />}
                            {resource.type === 'blog' && <FileText className="h-5 w-5 text-green-500" />}
                            {resource.type === 'notes' && <BookOpen className="h-5 w-5 text-purple-500" />}
                            <Badge variant="outline" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                              {resource.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{resource.stats.rating}</span>
                          </div>
                        </div>
                        
                        {resource.thumbnail && (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {resource.description}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          by {resource.author}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          {resource.stats.stars && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4" />
                              <span>{resource.stats.stars.toLocaleString()}</span>
                            </div>
                          )}
                          {resource.stats.views && (
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{resource.stats.views.toLocaleString()}</span>
                            </div>
                          )}
                          {resource.stats.downloads && (
                            <div className="flex items-center space-x-1">
                              <Download className="h-4 w-4" />
                              <span>{resource.stats.downloads.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => window.open(resource.url, '_blank')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};