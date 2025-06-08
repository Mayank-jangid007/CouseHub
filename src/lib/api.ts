import axios from 'axios';
import { SearchResult, LearningPath, TrendingItem, APIResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const GITHUB_API_URL = 'https://api.github.com';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced mock data with glassmorphism-ready content
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'React Official Documentation',
    description: 'The official React documentation with comprehensive guides and API reference.',
    url: 'https://react.dev',
    type: 'blog',
    metadata: {
      author: 'React Team',
      readTime: '45 min',
      tags: ['react', 'documentation', 'frontend'],
      difficulty: 'intermediate',
      rating: 4.9,
      views: 1250000,
    },
    aiSummary: 'Comprehensive official guide covering React fundamentals, hooks, and advanced patterns.',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'facebook/react',
    description: 'The library for web and native user interfaces',
    url: 'https://github.com/facebook/react',
    type: 'github',
    metadata: {
      stars: 220000,
      language: 'JavaScript',
      author: 'Facebook',
      tags: ['react', 'frontend', 'library'],
      difficulty: 'advanced',
      rating: 4.8,
    },
    aiSummary: 'Main React repository containing the core library source code and development tools.',
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'React Tutorial for Beginners',
    description: 'Complete React course from basics to advanced concepts',
    url: 'https://youtube.com/watch?v=example',
    type: 'youtube',
    metadata: {
      duration: '4:32:15',
      author: 'Code with Mosh',
      thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['react', 'tutorial', 'beginner'],
      difficulty: 'beginner',
      rating: 4.7,
      views: 850000,
    },
    aiSummary: 'Comprehensive React tutorial covering components, hooks, state management, and real projects.',
    createdAt: new Date(),
  },
  {
    id: 'roadmap-1',
    title: 'Frontend Developer Roadmap 2024',
    description: 'Complete learning path for becoming a frontend developer',
    url: '/roadmap/frontend-developer',
    type: 'roadmap',
    metadata: {
      author: 'CourseHub Team',
      tags: ['frontend', 'roadmap', 'career'],
      difficulty: 'beginner',
      rating: 4.8,
    },
    aiSummary: 'Structured learning path covering HTML, CSS, JavaScript, React, and modern frontend tools.',
    createdAt: new Date(),
  },
];

const mockRoadmaps: LearningPath[] = [
  {
    id: 'frontend-roadmap',
    title: 'Frontend Developer',
    description: 'Complete path to becoming a frontend developer',
    category: 'Web Development',
    difficulty: 'beginner',
    estimatedDuration: '6 months',
    completedBy: 15000,
    rating: 4.8,
    tags: ['html', 'css', 'javascript', 'react'],
    thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=400',
    nodes: [
      {
        id: 'html-basics',
        title: 'HTML Fundamentals',
        description: 'Learn HTML structure, elements, and semantic markup',
        type: 'topic',
        position: { x: 100, y: 100 },
        prerequisites: [],
        resources: { github: 25, youtube: 40, blogs: 30, notes: 15 },
        estimatedTime: '2 weeks',
        difficulty: 'beginner',
      },
      {
        id: 'css-basics',
        title: 'CSS Styling',
        description: 'Master CSS selectors, properties, and layouts',
        type: 'topic',
        position: { x: 300, y: 100 },
        prerequisites: ['html-basics'],
        resources: { github: 30, youtube: 50, blogs: 35, notes: 20 },
        estimatedTime: '3 weeks',
        difficulty: 'beginner',
      },
      {
        id: 'javascript-basics',
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript syntax, DOM manipulation, and ES6+',
        type: 'topic',
        position: { x: 500, y: 100 },
        prerequisites: ['css-basics'],
        resources: { github: 45, youtube: 60, blogs: 40, notes: 25 },
        estimatedTime: '4 weeks',
        difficulty: 'intermediate',
      },
      {
        id: 'react-basics',
        title: 'React Development',
        description: 'Build interactive UIs with React components and hooks',
        type: 'topic',
        position: { x: 700, y: 100 },
        prerequisites: ['javascript-basics'],
        resources: { github: 50, youtube: 70, blogs: 45, notes: 30 },
        estimatedTime: '6 weeks',
        difficulty: 'intermediate',
      },
      {
        id: 'final-project',
        title: 'Portfolio Project',
        description: 'Build a complete frontend application',
        type: 'project',
        position: { x: 900, y: 100 },
        prerequisites: ['react-basics'],
        resources: { github: 20, youtube: 15, blogs: 10, notes: 5 },
        estimatedTime: '3 weeks',
        difficulty: 'advanced',
      },
    ],
    connections: [
      { from: 'html-basics', to: 'css-basics' },
      { from: 'css-basics', to: 'javascript-basics' },
      { from: 'javascript-basics', to: 'react-basics' },
      { from: 'react-basics', to: 'final-project' },
    ],
  },
];

export const searchAPI = {
  // Search all resources
  searchAll: async (query: string): Promise<SearchResult[]> => {
    try {
      // In production, this would be a real API call
      // const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
      // return response.data.data;
      
      // Mock implementation with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.metadata.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      return filtered.map(result => ({
        ...result,
        relevanceScore: result.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
      })).sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search resources');
    }
  },

  // GitHub API integration
  searchGithub: async (query: string): Promise<SearchResult[]> => {
    try {
      const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      const headers = githubToken ? { Authorization: `token ${githubToken}` } : {};
      
      const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
        params: {
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: 20,
        },
        headers,
      });

      return response.data.items.map((repo: any) => ({
        id: `github-${repo.id}`,
        title: repo.full_name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        type: 'github' as const,
        metadata: {
          stars: repo.stargazers_count,
          language: repo.language,
          author: repo.owner.login,
          tags: repo.topics || [],
          difficulty: repo.stargazers_count > 10000 ? 'advanced' : 
                     repo.stargazers_count > 1000 ? 'intermediate' : 'beginner',
          rating: Math.min(5, Math.max(3, repo.stargazers_count / 10000)),
        },
        createdAt: new Date(repo.created_at),
      }));
    } catch (error) {
      console.error('GitHub search error:', error);
      return mockResults.filter(r => r.type === 'github');
    }
  },

  // YouTube API integration
  searchYouTube: async (query: string): Promise<SearchResult[]> => {
    try {
      const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (!youtubeApiKey) {
        throw new Error('YouTube API key not configured');
      }

      const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 20,
          key: youtubeApiKey,
        },
      });

      return response.data.items.map((video: any) => ({
        id: `youtube-${video.id.videoId}`,
        title: video.snippet.title,
        description: video.snippet.description,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        type: 'youtube' as const,
        metadata: {
          author: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails.medium.url,
          tags: video.snippet.tags || [],
          difficulty: 'intermediate',
          rating: 4.0 + Math.random(),
        },
        createdAt: new Date(video.snippet.publishedAt),
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return mockResults.filter(r => r.type === 'youtube');
    }
  },

  // Blog search (mock implementation)
  searchBlogs: async (query: string): Promise<SearchResult[]> => {
    try {
      // In production, integrate with Medium, Dev.to, Hashnode APIs
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockResults.filter(r => r.type === 'blog');
    } catch (error) {
      console.error('Blog search error:', error);
      return [];
    }
  },

  // Notes search
  searchNotes: async (query: string): Promise<SearchResult[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockResults.filter(r => r.type === 'notes');
    } catch (error) {
      console.error('Notes search error:', error);
      return [];
    }
  },

  // Roadmap search
  searchRoadmaps: async (query: string): Promise<SearchResult[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockResults.filter(r => r.type === 'roadmap');
    } catch (error) {
      console.error('Roadmap search error:', error);
      return [];
    }
  },

  // Get search suggestions
  getSuggestions: async (query: string): Promise<string[]> => {
    try {
      const popularSearches = [
        'React', 'JavaScript', 'Python', 'Machine Learning', 
        'Data Structures', 'Algorithms', 'Node.js', 'TypeScript',
        'Vue.js', 'Angular', 'Docker', 'Kubernetes', 'AWS',
        'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API'
      ];
      
      return popularSearches.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  },

  // AI features
  generateSummary: async (content: string): Promise<string> => {
    try {
      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiApiKey) {
        return 'AI summary not available - API key not configured';
      }

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries of educational content.'
          },
          {
            role: 'user',
            content: `Please provide a brief summary of this content: ${content}`
          }
        ],
        max_tokens: 150,
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI summary error:', error);
      return 'Summary not available';
    }
  },

  // Trending resources
  getTrendingResources: async (): Promise<TrendingItem[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Mock trending data
      return [
        {
          id: '1',
          title: 'Next.js 14 App Router Complete Guide',
          description: 'Master the new App Router in Next.js 14 with server components.',
          type: 'youtube',
          url: 'https://youtube.com/watch?v=example1',
          thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
          metadata: {
            author: 'Vercel',
            views: 125000,
            duration: '2:45:30',
            tags: ['nextjs', 'react', 'app-router'],
            trending_score: 98,
            growth_rate: '+245%'
          }
        },
      ];
    } catch (error) {
      console.error('Trending resources error:', error);
      return [];
    }
  },
};

export const roadmapAPI = {
  getAllRoadmaps: async (): Promise<LearningPath[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockRoadmaps;
    } catch (error) {
      console.error('Roadmaps fetch error:', error);
      return [];
    }
  },

  getRoadmapById: async (id: string): Promise<LearningPath | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockRoadmaps.find(roadmap => roadmap.id === id) || null;
    } catch (error) {
      console.error('Roadmap fetch error:', error);
      return null;
    }
  },

  updateNodeProgress: async (roadmapId: string, nodeId: string, completed: boolean): Promise<void> => {
    try {
      // In production, this would update the backend
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`Updated node ${nodeId} in roadmap ${roadmapId}: ${completed}`);
    } catch (error) {
      console.error('Progress update error:', error);
      throw error;
    }
  },
};

export const bookmarkAPI = {
  getUserBookmarks: async (userId: string): Promise<SearchResult[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Mock user bookmarks
      return mockResults.slice(0, 3);
    } catch (error) {
      console.error('Bookmarks fetch error:', error);
      return [];
    }
  },

  addBookmark: async (userId: string, resourceId: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`Added bookmark ${resourceId} for user ${userId}`);
    } catch (error) {
      console.error('Add bookmark error:', error);
      throw error;
    }
  },

  removeBookmark: async (userId: string, resourceId: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`Removed bookmark ${resourceId} for user ${userId}`);
    } catch (error) {
      console.error('Remove bookmark error:', error);
      throw error;
    }
  },
};