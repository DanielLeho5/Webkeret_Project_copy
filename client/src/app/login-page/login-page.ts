import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthForm } from '../auth-form/auth-form';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthForm, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

}
