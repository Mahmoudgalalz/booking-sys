import { apiService } from './api-service';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: number;
    name: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface ProviderData {
  bio?: string;
  specialization?: string;
  experience?: string;
  profileImage?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Authentication service for handling user authentication
 */
export class AuthService {
  private currentUser: User | null = null;
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson);
        return this.currentUser;
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
    
    return null;
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!localStorage.getItem('auth_token');
  }
  
  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role.name === role;
  }
  
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials, false);
    
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser = response.user;
    
    return response.user;
  }
  
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    const response = await apiService.post<AuthResponse>('/auth/register', data, false);
    
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser = response.user;
    
    return response.user;
  }
  
  /**
   * Complete provider profile
   */
  async completeProviderProfile(data: ProviderData): Promise<User> {
    const response = await apiService.post<AuthResponse>('/providers/profile', data);
    
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser = response.user;
    
    return response.user;
  }
  
  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUser = null;
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
