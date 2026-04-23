/**
 * useAuth Composable with TanStack Query
 * Manages authentication state and operations
 *
 * State is declared OUTSIDE the function so all component instances
 * share the same reactive references (singleton pattern).
 */

import { ref, computed } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { authService } from '../services/authService';
import type { LoginRequest, RegisterRequest, ProductResult } from '../types';

// --- Shared global state (singleton) ---
const isAuthenticated = ref(authService.isAuthenticated());
const isLoggingIn = ref(false);
const isRegistering = ref(false);

export function useAuth() {
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginRequest) =>
      authService.login(email, password),
    onSuccess: () => {
      isAuthenticated.value = true;
      isLoggingIn.value = false;
    },
    onError: () => {
      isLoggingIn.value = false;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: ({ userName, email, password }: RegisterRequest) =>
      authService.register(userName, email, password),
    onSuccess: () => {
      isRegistering.value = false;
    },
    onError: () => {
      isRegistering.value = false;
    },
  });

  // Login wrapper with error handling
  const login = async (email: string, password: string): Promise<ProductResult> => {
    try {
      isLoggingIn.value = true;
      await loginMutation.mutateAsync({ email, password });
      return { success: true };
    } catch (error: unknown) {
      const err = error as Record<string, any>;
      const message =
        err?.message ||
        err?.error?.message ||
        err?.detail ||
        err?.title ||
        'Failed to login';
      isLoggingIn.value = false;
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
      isRegistering.value = true;
      await registerMutation.mutateAsync({ userName, email, password });
      return { success: true };
    } catch (error: unknown) {
      const err = error as Record<string, any>;
      const message =
        err?.message ||
        err?.error?.message ||
        err?.detail ||
        err?.title ||
        'Failed to register';
      isRegistering.value = false;
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
    isLoggingIn: computed(() => isLoggingIn.value),
    isRegistering: computed(() => isRegistering.value),
    loginError: computed(() => loginMutation.error.value),
    registerError: computed(() => registerMutation.error.value),
  };
}
