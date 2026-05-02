import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, RouterOutlet, MatSidenavModule, MatListModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.hasValidToken();
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  get isGuest(): boolean {
    return !this.isLoggedIn;
  }

  logout() {
    this.authService.logout();
    this.sidebarService.close();
    this.router.navigate(['/login']);
  }
}
