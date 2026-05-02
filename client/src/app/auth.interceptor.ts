import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip interceptor on server-side rendering
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');
    if (!isAuthRequest) {
      router.navigateByUrl('/login');
      return EMPTY;
    }
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        authService.logout();

        const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');
        if (!isAuthRequest && router.url !== '/login') {
          router.navigateByUrl('/login');
        }

        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};