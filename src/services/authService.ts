import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/auth';

// Request/Response Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  college_id: number;
  class_name?: string;
  year?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  class_name?: string;
  year?: number;
  bio?: string;
}

export interface BackendUser {
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
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: {
    user: BackendUser;
    token: string;
  };
  error?: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface UserProfileApiResponse {
  success: boolean;
  data?: BackendUser;
  error?: string;
}

export interface UpdateProfileApiResponse {
  success: boolean;
  message?: string;
  data?: BackendUser;
  error?: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register user
export const registerUser = async (data: RegisterRequest): Promise<AuthApiResponse> => {
  try {
    const response = await apiClient.post<AuthApiResponse>('/register', data);
    
    // Save token and user to localStorage
    if (response.data.success && response.data.data) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Login user
export const loginUser = async (data: LoginRequest): Promise<AuthApiResponse> => {
  try {
    const response = await apiClient.post<AuthApiResponse>('/login', data);
    
    // Save token and user to localStorage
    if (response.data.success && response.data.data) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<UserProfileApiResponse> => {
  try {
    const response = await apiClient.get<UserProfileApiResponse>('/me');
    
    // Update stored user data
    if (response.data.success && response.data.data) {
      localStorage.setItem('auth_user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileApiResponse> => {
  try {
    const response = await apiClient.put<UpdateProfileApiResponse>('/profile', data);
    
    // Update stored user data
    if (response.data.success && response.data.data) {
      localStorage.setItem('auth_user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Get stored user
export const getStoredUser = (): BackendUser | null => {
  const user = localStorage.getItem('auth_user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  return null;
};
