import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

const emptyLogin = {
  email: "john@test.com",
  password: "123456",
};

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const isAuthenticated = useMemo(() => !!token, [token]);

  useEffect(() => {
    if (token) {
      loadProducts();
    } else {
      setProducts([]);
    }
  }, [token]);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "No se pudo iniciar sesión.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setMessage("Login correcto.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadProducts() {
    setLoadingProducts(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "No se pudieron cargar los productos.");
      }

      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.detail || "No se pudo crear el producto.");
      }

      setProductForm(emptyProduct);
      setMessage("Producto creado.");
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteProduct(id) {
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        throw new Error(data?.detail || "No se pudo eliminar el producto.");
      }

      setMessage("Producto eliminado.");
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setMessage("Sesión cerrada.");
  }

  return (
    <main className="page">
      <div className="card">
        <h1>React Client</h1>
        <p>Bienvenido</p>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="form">
            <input
              type="email"
              placeholder="Correo"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <button type="submit">Iniciar sesión</button>
          </form>
        ) : (
          <>
            <div className="toolbar">
              <button onClick={loadProducts}>Recargar</button>
              <button onClick={logout}>Cerrar sesión</button>
            </div>

            <form onSubmit={handleCreateProduct} className="form">
              <input
                placeholder="Nombre"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
              />
              <input
                placeholder="Descripción"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Stock"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({ ...productForm, stock: e.target.value })
                }
              />
              <button type="submit">Crear producto</button>
            </form>

            <section className="list">
              <h2>Productos</h2>
              {loadingProducts ? (
                <p>Cargando...</p>
              ) : products.length === 0 ? (
                <p>No hay productos.</p>
              ) : (
                products.map((product) => (
                  <article key={product.id} className="item">
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.description || "Sin descripción"}</p>
                      <small>
                        Precio: ${product.price} | Stock: {product.stock}
                      </small>
                    </div>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      Eliminar
                    </button>
                  </article>
                ))
              )}
            </section>
          </>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </main>
  );
}
