import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Skip guard during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return true;
    }

    if (this.authService.hasValidToken()) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}