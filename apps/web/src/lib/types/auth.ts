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
