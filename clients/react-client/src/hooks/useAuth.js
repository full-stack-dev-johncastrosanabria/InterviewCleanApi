/**
 * useAuth Hook
 * Manages authentication state and operations
 */

import { useState, useCallback } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userName, email, password) => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(userName, email, password);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return {
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
}
