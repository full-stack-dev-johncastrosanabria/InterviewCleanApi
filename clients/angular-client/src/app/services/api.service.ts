/**
 * API Service
 * Base HTTP client configuration
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error - improved error extraction
      if (error.error?.error?.message) {
        errorMessage = error.error.error.message;
      } else if (error.error?.detail) {
        errorMessage = error.error.detail;
      } else if (error.error?.title) {
        errorMessage = error.error.title;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
