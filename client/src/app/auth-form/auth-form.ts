import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {
  @Input() title: string = 'Authentication';
  @Input() isRegistration: boolean = false;

  authForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.authForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Make name required for registration
    if (this.isRegistration) {
      this.authForm.get('name')?.setValidators([Validators.required]);
    }
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.isLoading = true;
      const { name, email, password } = this.authForm.value;

      const authMethod = this.isRegistration
        ? this.authService.register(name, email, password)
        : this.authService.login(email, password);

      authMethod.subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          if (this.isRegistration) {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
