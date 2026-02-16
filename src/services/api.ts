import type {
  AuthResponse,
  DashboardData,
  Resource,
  Comment,
  User,
  LeaderboardEntry,
  PaginatedResponse,
  ResourceFilters,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      ...(options.headers || {}),
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    name: string;
    email: string;
    branch: string;
    semester: number;
    password: string;
  }): Promise<{ message: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    return this.request('/dashboard');
  }

  // Resources
  async getResources(filters: ResourceFilters = {}): Promise<PaginatedResponse<Resource>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return this.request(`/resources?${params.toString()}`);
  }

  async getResource(id: string): Promise<Resource> {
    return this.request(`/resources/${id}`);
  }

  async uploadResource(formData: FormData): Promise<Resource> {
    return this.request('/resources/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
    return this.request(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResource(id: string): Promise<void> {
    return this.request(`/resources/${id}`, { method: 'DELETE' });
  }

  async downloadResource(id: string): Promise<Blob> {
    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/resources/${id}/download`, { headers });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }

  async rateResource(id: string, rating: number): Promise<void> {
    return this.request(`/resources/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  // Bookmarks
  async toggleBookmark(id: string): Promise<void> {
    return this.request(`/bookmarks/${id}`, { method: 'POST' });
  }

  // Comments
  async getComments(resourceId: string): Promise<Comment[]> {
    return this.request(`/resources/${resourceId}/comments`);
  }

  async addComment(resourceId: string, content: string): Promise<Comment> {
    return this.request(`/resources/${resourceId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // User
  async getMyUploads(): Promise<Resource[]> {
    return this.request('/users/me/uploads');
  }

  async getProfile(): Promise<User> {
    return this.request('/users/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request('/leaderboard');
  }
}

export const api = new ApiService();
