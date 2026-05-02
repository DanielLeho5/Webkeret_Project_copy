import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-account-actions-component',
  imports: [MatButtonModule],
  templateUrl: './account-actions-component.html',
  styleUrl: './account-actions-component.css',
})
export class AccountActionsComponent {
  constructor(private themeService: ThemeService) {}

  isDark(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onLogout() {
    // TODO: Implement logout logic
    console.log('Logging out...');
    alert('Logged out successfully!');
  }
}
