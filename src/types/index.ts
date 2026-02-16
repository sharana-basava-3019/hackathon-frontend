// Backend User structure
export interface User {
  id: number;
  name: string;
  email: string;
  college_id: number;
  college_name?: string;
  college_code?: string;
  class_name: string | null;
  year: number | null;
  profile_picture: string | null;
  bio: string | null;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
  // Legacy fields for compatibility
  branch?: string;
  semester?: number;
  avatar?: string;
  contributionPoints?: number;
  createdAt?: string;
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
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
  error?: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface ResourceFilters {
  search?: string;
  branch?: string;
  semester?: string;
  type?: string;
  subject?: string;
  sort?: 'latest' | 'downloads' | 'rating';
}
