import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

function createJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${header}.${body}.signature`;
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('returns false for hasValidToken when no token exists', () => {
    expect(service.hasValidToken()).toBe(false);
  });

  it('returns true for hasValidToken when token is not expired', () => {
    const token = createJwt({ exp: Math.floor(Date.now() / 1000) + 3600, role: 'user' });
    localStorage.setItem('token', token);

    expect(service.hasValidToken()).toBe(true);
  });

  it('returns false for hasValidToken when token is expired', () => {
    const token = createJwt({ exp: Math.floor(Date.now() / 1000) - 60, role: 'user' });
    localStorage.setItem('token', token);

    expect(service.hasValidToken()).toBe(false);
  });

  it('returns admin from getUserRole when JWT contains admin role', () => {
    const token = createJwt({ exp: Math.floor(Date.now() / 1000) + 3600, role: 'admin' });
    localStorage.setItem('token', token);

    expect(service.getUserRole()).toBe('admin');
  });

  it('clears token on logout', () => {
    localStorage.setItem('token', 'token-value');
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('returns null token on server platform', () => {
    const serverService = new AuthService({} as HttpClient, 'server');

    expect(serverService.getToken()).toBeNull();
  });
});
