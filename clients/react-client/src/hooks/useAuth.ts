/**
 * useAuth Hook with TanStack Query
 * Manages authentication state and operations
 */

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { AuthResult } from '../types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: () => {
      setIsAuthenticated(true);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ 
      userName, 
      email, 
      password 
    }: { 
      userName: string; 
      email: string; 
      password: string;
    }) => authService.register(userName, email, password),
  });

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        await loginMutation.mutateAsync({ email, password });
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        return { success: false, error: message };
      }
    },
    [loginMutation]
  );

  const register = useCallback(
    async (userName: string, email: string, password: string): Promise<AuthResult> => {
      try {
        await registerMutation.mutateAsync({ userName, email, password });
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        return { success: false, error: message };
      }
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    loading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
    login,
    register,
    logout,
  };
}
