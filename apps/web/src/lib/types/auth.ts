export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export type Role = 'provider' | 'user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface ProviderData {
  bio?: string;
  specialization?: string;
  experience?: string;
  profileImage?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthData {
  accessToken: string;
  user: User;
  role: Role;
}

export type AuthResponse = ApiResponse<AuthData>;

