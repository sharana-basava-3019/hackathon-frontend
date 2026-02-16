export interface User {
  id: string;
  name: string;
  email: string;
  branch: string;
  semester: number;
  avatar?: string;
  contributionPoints: number;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  subject: string;
  branch: string;
  semester: number;
  type: 'notes' | 'paper' | 'assignment' | 'book' | 'other';
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: User;
  downloads: number;
  rating: number;
  ratingCount: number;
  bookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

export interface DashboardData {
  contributionPoints: number;
  recentUploads: Resource[];
  trendingResources: Resource[];
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ResourceFilters {
  search?: string;
  branch?: string;
  semester?: string;
  type?: string;
  subject?: string;
  sort?: 'latest' | 'downloads' | 'rating';
}
