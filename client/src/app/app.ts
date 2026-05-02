import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { SidebarService } from './sidebar.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('food-health-app');

  constructor(
    public sidebarService: SidebarService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.initializeTheme();
  }
}
