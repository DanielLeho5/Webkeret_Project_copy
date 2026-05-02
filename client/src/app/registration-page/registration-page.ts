import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthForm } from '../auth-form/auth-form';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [AuthForm, RouterModule],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css',
})
export class RegistrationPage {

}
