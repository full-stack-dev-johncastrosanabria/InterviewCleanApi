/**
 * useAuth Composable with TanStack Query
 * Manages authentication state and operations
 */

import { ref, computed } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { authService } from '../services/authService';
import type { LoginRequest, RegisterRequest, ProductResult } from '../types';

export function useAuth() {
  const isAuthenticated = ref(authService.isAuthenticated());

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginRequest) => 
      authService.login(email, password),
    onSuccess: () => {
      isAuthenticated.value = true;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: ({ userName, email, password }: RegisterRequest) =>
      authService.register(userName, email, password),
  });

  // Login wrapper with error handling
  const login = async (email: string, password: string): Promise<ProductResult> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return { success: true };
    } catch (error: any) {
      let message = 'Failed to login';
      
      if (error?.message) {
        message = error.message;
      } else if (error?.error?.message) {
        message = error.error.message;
      } else if (error?.detail) {
        message = error.detail;
      } else if (error?.title) {
        message = error.title;
      }
      
      return { success: false, error: message };
    }
  };

  // Register wrapper with error handling
  const register = async (
    userName: string, 
    email: string, 
    password: string
  ): Promise<ProductResult> => {
    try {
      await registerMutation.mutateAsync({ userName, email, password });
      return { success: true };
    } catch (error: any) {
      let message = 'Failed to register';
      
      if (error?.message) {
        message = error.message;
      } else if (error?.error?.message) {
        message = error.error.message;
      } else if (error?.detail) {
        message = error.detail;
      } else if (error?.title) {
        message = error.title;
      }
      
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    isAuthenticated.value = false;
  };

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    register,
    logout,
    isLoggingIn: computed(() => loginMutation.isPending.value),
    isRegistering: computed(() => registerMutation.isPending.value),
    loginError: computed(() => loginMutation.error.value),
    registerError: computed(() => registerMutation.error.value),
  };
}
