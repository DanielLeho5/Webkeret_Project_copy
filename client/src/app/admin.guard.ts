import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
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

    if (!this.authService.hasValidToken()) {
      this.authService.logout();
      return this.router.createUrlTree(['/login']);
    }

    if (this.authService.getUserRole() === 'admin') {
      return true;
    }

    return this.router.createUrlTree(['/home']);
  }
}