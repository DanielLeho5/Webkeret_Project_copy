import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(ThemeService);
    document = TestBed.inject(DOCUMENT);
    document.body.classList.remove('dark');
  });

  it('initializes dark mode from saved theme', () => {
    localStorage.setItem('theme', 'dark');

    service.initializeTheme();

    expect(service.isDark()).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('defaults to light mode when no saved theme exists', () => {
    service.initializeTheme();

    expect(service.isDark()).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('toggles theme and persists new value', () => {
    service.initializeTheme();
    service.toggleTheme();

    expect(service.isDark()).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggleTheme();

    expect(service.isDark()).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
