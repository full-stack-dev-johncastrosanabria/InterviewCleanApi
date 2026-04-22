/**
 * Main App Component - React Client
 * TypeScript + TanStack Query + Clean Architecture
 */

import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import { LoginForm } from './components/LoginForm';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import type { ProductRequest } from './types';
import './styles/globals.css';
import './App.css';

export default function App() {
  const { isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const {
    products,
    loading: productsLoading,
    loadProducts,
    createProduct,
    deleteProduct,
    isCreating,
  } = useProducts();

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, loadProducts]);

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setMessage('¡Bienvenido! Sesión iniciada correctamente.');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error || 'Error al iniciar sesión');
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('Sesión cerrada correctamente.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateProduct = async (productData: ProductRequest) => {
    const result = await createProduct(productData);
    if (result.success) {
      setMessage('✓ Producto creado exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error || 'Error al crear producto');
    }
    return result;
  };

  const handleDeleteProduct = async (id: number) => {
    const result = await deleteProduct(id);
    if (result.success) {
      setMessage('✓ Producto eliminado exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error || 'Error al eliminar producto');
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>React Client</h1>
          <p>Clean Architecture con TypeScript + TanStack Query</p>
          <div className="framework-badge">⚛️ React Ocean Theme</div>
        </header>

        {message && (
          <div className={`message ${message.includes('✓') || message.includes('Bienvenido') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} loading={authLoading} />
        ) : (
          <>
            <div className="toolbar">
              <button
                className="btn btn-secondary"
                onClick={() => loadProducts()}
                disabled={productsLoading}
                data-testid="reload-button"
              >
                🔄 Recargar Productos
              </button>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                🚪 Cerrar Sesión
              </button>
            </div>

            <div className="card">
              <ProductForm
                onSubmit={handleCreateProduct}
                loading={isCreating}
              />
            </div>

            <ProductList
              products={products}
              loading={productsLoading}
              onDelete={handleDeleteProduct}
            />
          </>
        )}
      </div>
    </div>
  );
}
