/**
 * Authentication Models
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface User {
  email: string;
  userName: string;
}
