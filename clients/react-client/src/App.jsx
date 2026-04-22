/**
 * Main App Component - React Client
 * Clean Architecture with separated concerns
 */

import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import { LoginForm } from './components/LoginForm';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import './App.css';

export default function App() {
  const { isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const {
    products,
    loading: productsLoading,
    loadProducts,
    createProduct,
    deleteProduct,
  } = useProducts();

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, loadProducts]);

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      setMessage('¡Bienvenido! Sesión iniciada correctamente.');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('Sesión cerrada correctamente.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateProduct = async (productData) => {
    const result = await createProduct(productData);
    if (result.success) {
      setMessage('✓ Producto creado exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error);
    }
    return result;
  };

  const handleDeleteProduct = async (id) => {
    const result = await deleteProduct(id);
    if (result.success) {
      setMessage('✓ Producto eliminado exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error);
    }
  };

  return (
    <main className="app">
      <div className="container">
        <header className="app-header">
          <div className="brand">
            <h1>⚛️ React Client</h1>
            <p>Clean Architecture + Hooks + Services</p>
          </div>
          {isAuthenticated && (
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
              data-testid="logout-button"
            >
              Cerrar Sesión
            </button>
          )}
        </header>

        {message && (
          <div className="message" data-testid="message">
            {message}
          </div>
        )}

        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} loading={authLoading} />
        ) : (
          <>
            <ProductForm
              onSubmit={handleCreateProduct}
              loading={productsLoading}
            />

            <div className="toolbar">
              <button
                className="btn btn-secondary"
                onClick={loadProducts}
                disabled={productsLoading}
                data-testid="reload-button"
              >
                🔄 Recargar
              </button>
            </div>

            <ProductList
              products={products}
              loading={productsLoading}
              onDelete={handleDeleteProduct}
            />
          </>
        )}
      </div>
    </main>
  );
}
