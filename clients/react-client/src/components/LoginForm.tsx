/**
 * LoginForm Component
 * Handles user authentication with professional design
 */

import { useState, type FormEvent } from 'react';
import './LoginForm.css';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export function LoginForm({ onLogin, loading }: LoginFormProps) {
  const [email, setEmail] = useState('john@test.com');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} data-testid="login-form">
      <div className="form-header">
        <h2>⚛️ Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
          data-testid="email-input"
          className={errors.email ? 'error' : ''}
        />
        <div className="input-highlight" />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={loading}
          data-testid="password-input"
          className={errors.password ? 'error' : ''}
        />
        <div className="input-highlight" />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <button 
        type="submit" 
        className={`btn btn-primary ${loading ? 'loading' : ''}`}
        disabled={loading}
        data-testid="login-button"
      >
        {loading ? '' : '🚀 Sign In'}
      </button>
    </form>
  );
}
