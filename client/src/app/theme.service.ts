import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly isDark = signal(false);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    this.applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.isDark() ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }

  private applyTheme(theme: ThemeMode): void {
    this.isDark.set(theme === 'dark');

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (theme === 'dark') {
      this.document.body.classList.add('dark');
    } else {
      this.document.body.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }
}