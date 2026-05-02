import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthForm } from './auth-form';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AuthForm', () => {
  let component: AuthForm;
  let fixture: ComponentFixture<AuthForm>;
  let authServiceMock: { login: ReturnType<typeof vi.fn>; register: ReturnType<typeof vi.fn> };
  let snackBarMock: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
      register: vi.fn()
    };
    snackBarMock = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AuthForm],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('keeps the form invalid until email and password are valid', () => {
    expect(component.authForm.valid).toBe(false);

    component.authForm.setValue({
      name: '',
      email: 'alice@example.com',
      password: 'password123'
    });

    expect(component.authForm.valid).toBe(true);

    component.authForm.setValue({
      name: '',
      email: 'invalid-email',
      password: '123'
    });

    expect(component.authForm.invalid).toBe(true);
  });
});
