/**
 * LoginForm Component
 * Handles user authentication
 */

import { useState } from 'react';
import './LoginForm.css';

export function LoginForm({ onLogin, loading }) {
  const [email, setEmail] = useState('john@test.com');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} data-testid="login-form">
      <h2>Iniciar Sesión</h2>
      
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          disabled={loading}
          data-testid="email-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          required
          disabled={loading}
          data-testid="password-input"
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={loading}
        data-testid="login-button"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
