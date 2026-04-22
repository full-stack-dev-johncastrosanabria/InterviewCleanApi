/**
 * Main App Component - Angular Client
 * Clean Architecture with Services and Components
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Product, ProductRequest } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    ProductFormComponent,
    ProductListComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild(LoginFormComponent) loginForm?: LoginFormComponent;
  @ViewChild(ProductFormComponent) productForm?: ProductFormComponent;

  isAuthenticated = false;
  products: Product[] = [];
  loading = false;
  message = '';

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.loadProducts();
      } else {
        this.products = [];
      }
    });
  }

  onLogin(credentials: { email: string; password: string }): void {
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.showMessage('¡Bienvenido! Sesión iniciada correctamente.');
        this.loginForm?.setLoading(false);
      },
      error: (error) => {
        this.showMessage(error.message);
        this.loginForm?.setLoading(false);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.showMessage('Sesión cerrada correctamente.');
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.showMessage(error.message);
        this.loading = false;
      }
    });
  }

  onProductSubmit(product: ProductRequest): void {
    this.productService.create(product).subscribe({
      next: () => {
        this.showMessage('✓ Producto creado exitosamente');
        this.productForm?.reset();
        this.loadProducts();
      },
      error: (error) => {
        this.showMessage(error.message);
        this.productForm?.setLoading(false);
      }
    });
  }

  onProductDelete(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        this.showMessage('✓ Producto eliminado exitosamente');
        this.loadProducts();
      },
      error: (error) => {
        this.showMessage(error.message);
      }
    });
  }

  private showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
