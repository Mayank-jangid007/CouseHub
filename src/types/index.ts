export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'github' | 'youtube' | 'blog' | 'notes' | 'roadmap';
  metadata: {
    stars?: number;
    language?: string;
    author?: string;
    duration?: string;
    thumbnail?: string;
    readTime?: string;
    downloadUrl?: string;
    tags: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    rating?: number;
    views?: number;
    downloads?: number;
  };
  aiSummary?: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bookmarks: string[];
  searchHistory?: string[];
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailUpdates: boolean;
  };
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  filters: {
    type: 'all' | 'github' | 'youtube' | 'blog' | 'notes' | 'roadmap';
    sortBy: 'relevance' | 'date' | 'popularity';
    difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'topic' | 'project' | 'assessment';
  position: { x: number; y: number };
  prerequisites: string[];
  resources: {
    github: number;
    youtube: number;
    blogs: number;
    notes: number;
  };
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  nodes: RoadmapNode[];
  connections: Array<{ from: string; to: string }>;
  completedBy: number;
  rating: number;
  tags: string[];
  thumbnail: string;
}

export interface TrendingItem {
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

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}