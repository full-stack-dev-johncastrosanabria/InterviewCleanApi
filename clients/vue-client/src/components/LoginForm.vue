<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const { login, isLoggingIn } = useAuth();

const email = ref(import.meta.env.VITE_TEST_EMAIL || '');
const password = ref(import.meta.env.VITE_TEST_PASSWORD || '');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  
  const result = await login(email.value, password.value);
  
  if (!result.success) {
    error.value = result.error || 'Failed to login';
  }
};
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit" data-testid="login-form">
    <div class="form-header">
      <h2>🌿 Iniciar Sesión</h2>
      <p>Accede a tu cuenta</p>
    </div>
    
    <div class="form-group">
      <label for="email">Correo electrónico</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="tu@email.com"
        required
        data-testid="email-input"
      />
    </div>

    <div class="form-group">
      <label for="password">Contraseña</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="••••••••"
        required
        data-testid="password-input"
      />
    </div>

    <button 
      type="submit" 
      :disabled="isLoggingIn"
      :class="['btn', 'btn-primary', { 'loading': isLoggingIn }]"
      data-testid="login-button"
    >
      <span v-if="!isLoggingIn">🚀 Iniciar Sesión</span>
      <span v-else>Iniciando sesión...</span>
    </button>

    <div v-if="error" class="error-message" data-testid="error-message">
      ⚠️ {{ error }}
    </div>
  </form>
</template>

<style scoped>
/* Vue Login Form - Forest Theme */
.login-form {
  background: var(--card-gradient);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  max-width: 420px;
  margin: 0 auto;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.6s ease-out;
}

.login-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-500), var(--secondary-500), var(--primary-500));
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  margin-bottom: 0.5rem;
  color: var(--neutral-50);
  font-size: 1.875rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-400), var(--secondary-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-header p {
  color: var(--neutral-300);
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--neutral-300);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-600);
  background: rgba(6, 78, 59, 0.3);
  color: var(--neutral-100);
  font-size: 1rem;
  transition: all var(--transition-normal);
  backdrop-filter: blur(5px);
}

.form-group input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1), var(--shadow-glow);
  background: rgba(6, 78, 59, 0.5);
}

.form-group input::placeholder {
  color: var(--neutral-400);
}

.btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-primary {
  background: var(--button-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  background: var(--button-hover-gradient);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

.btn:hover::before {
  left: 100%;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  color: #fca5a5;
  font-size: 0.875rem;
  text-align: center;
  animation: slideIn 0.3s ease-out;
}

/* Loading State */
.btn.loading {
  position: relative;
  color: transparent;
}

.btn.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-form {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
}
</style>
