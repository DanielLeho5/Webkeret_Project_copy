import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean | UrlTree {
    // Skip guard during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return true;
    }

    if (this.authService.hasValidToken()) {
      return true;
    } else {
      this.authService.logout();
      return this.router.createUrlTree(['/login']);
    }
  }
}