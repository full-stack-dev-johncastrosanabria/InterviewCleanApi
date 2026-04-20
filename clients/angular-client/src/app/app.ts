import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

type LoginResponse = {
  token: string;
  expiresAtUtc: string;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAtUtc: string;
};

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  apiBase = 'http://localhost:5000';

  email = 'john@test.com';
  password = '123456';

  token = localStorage.getItem('token') ?? '';
  message = '';
  products: Product[] = [];
  loadingProducts = false;

  name = '';
  description = '';
  price = '';
  stock = '';

  async ngOnInit() {
    if (this.token) {
      await this.loadProducts();
    }
  }

  async login() {
    this.message = '';
    this.products = [];
    this.loadingProducts = false;
    this.cdr.detectChanges();

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiBase}/api/auth/login`, {
          email: this.email,
          password: this.password
        })
      );

      this.token = response.token;
      localStorage.setItem('token', this.token);

      await this.loadProducts();

      this.message = 'Login correcto.';
      this.cdr.detectChanges();
    } catch (error: any) {
      this.message =
        error?.error?.detail ||
        error?.message ||
        'No se pudo iniciar sesión.';
      this.cdr.detectChanges();
    }
  }

  async loadProducts() {
    if (!this.token) {
      this.products = [];
      this.loadingProducts = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadingProducts = true;
    this.message = '';
    this.cdr.detectChanges();

    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      });

      const data = await firstValueFrom(
        this.http.get<Product[]>(`${this.apiBase}/api/products`, { headers })
      );

      this.products = data ?? [];
    } catch (error: any) {
      this.products = [];
      this.message =
        error?.error?.detail ||
        error?.message ||
        'No se pudieron cargar los productos.';
    } finally {
      this.loadingProducts = false;
      this.cdr.detectChanges();
    }
  }

  async createProduct() {
    this.message = '';
    this.cdr.detectChanges();

    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      });

      await firstValueFrom(
        this.http.post(
          `${this.apiBase}/api/products`,
          {
            name: this.name,
            description: this.description,
            price: Number(this.price),
            stock: Number(this.stock)
          },
          { headers }
        )
      );

      this.name = '';
      this.description = '';
      this.price = '';
      this.stock = '';

      await this.loadProducts();
      this.message = 'Producto creado.';
      this.cdr.detectChanges();
    } catch (error: any) {
      this.message =
        error?.error?.detail ||
        error?.message ||
        'No se pudo crear el producto.';
      this.cdr.detectChanges();
    }
  }

  async deleteProduct(id: number) {
    this.message = '';
    this.cdr.detectChanges();

    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      });

      await firstValueFrom(
        this.http.delete(`${this.apiBase}/api/products/${id}`, { headers })
      );

      await this.loadProducts();
      this.message = 'Producto eliminado.';
      this.cdr.detectChanges();
    } catch (error: any) {
      this.message =
        error?.error?.detail ||
        error?.message ||
        'No se pudo eliminar el producto.';
      this.cdr.detectChanges();
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.token = '';
    this.products = [];
    this.loadingProducts = false;
    this.message = 'Sesión cerrada.';
    this.cdr.detectChanges();
  }
}