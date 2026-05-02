import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './models/user.model';
import { environment } from '../environments/environment';

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token && this.isBrowserStorageAvailable()) {
            localStorage.setItem('token', response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    if (this.isBrowserStorageAvailable()) {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (!this.isBrowserStorageAvailable()) {
      return null;
    }

    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  getUserRole(): 'user' | 'admin' | null {
    if (!this.hasValidToken()) {
      return null;
    }

    const payload = this.getTokenPayload();
    if (!payload || (payload.role !== 'user' && payload.role !== 'admin')) {
      return null;
    }

    return payload.role;
  }

  hasValidToken(): boolean {
    const payload = this.getTokenPayload();
    if (!payload) {
      return false;
    }

    if (!payload.exp || typeof payload.exp !== 'number') {
      return true;
    }

    return Date.now() < payload.exp * 1000;
  }

  private getTokenPayload(): { exp?: number; role?: string } | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        return null;
      }

      const normalizedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(normalizedPayload.padEnd(normalizedPayload.length + (4 - (normalizedPayload.length % 4)) % 4, '=')));
    } catch {
      return null;
    }
  }

  private isBrowserStorageAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}