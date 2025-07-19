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

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthData {
  accessToken: string;
  role: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  type: string;
  roleId: number;
}

export type AuthResponse = ApiResponse<AuthData>;

