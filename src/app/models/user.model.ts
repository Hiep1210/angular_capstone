import { Permission } from './permission.model';

export interface User {
  username: string;
  password: string;
  role: string;
  name: string;
  address: string;
  permissions?: Permission[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  name: string;
  address: string;
  role?: string;
}

