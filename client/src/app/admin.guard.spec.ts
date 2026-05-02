import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from './auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceMock: {
    hasValidToken: ReturnType<typeof vi.fn>;
    getUserRole: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceMock = {
      hasValidToken: vi.fn(),
      getUserRole: vi.fn(),
      logout: vi.fn()
    };

    routerMock = {
      createUrlTree: vi.fn((commands: string[]) => ({ commands } as unknown as UrlTree))
    };

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('allows access when user role is admin and token is valid', () => {
    authServiceMock.hasValidToken.mockReturnValue(true);
    authServiceMock.getUserRole.mockReturnValue('admin');

    expect(guard.canActivate()).toBe(true);
  });

  it('redirects to login and logs out when token is invalid', () => {
    authServiceMock.hasValidToken.mockReturnValue(false);

    const result = guard.canActivate();

    expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual({ commands: ['/login'] });
  });

  it('redirects non-admin users to home', () => {
    authServiceMock.hasValidToken.mockReturnValue(true);
    authServiceMock.getUserRole.mockReturnValue('user');

    const result = guard.canActivate();

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/home']);
    expect(result).toEqual({ commands: ['/home'] });
  });
});
