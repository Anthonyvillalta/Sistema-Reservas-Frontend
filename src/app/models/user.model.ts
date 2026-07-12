export type UserRole = 'ADMIN' | 'ASISTENTE' | 'CLIENT';

export interface User {
  id: number;
  username: string;
  nombreCompleto: string;
  email: string;
  role: UserRole;
  activo: boolean;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  id: number;
  username: string;
  nombreCompleto: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}
