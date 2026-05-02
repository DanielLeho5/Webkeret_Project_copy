import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileSettingsComponent } from '../profile-settings-component/profile-settings-component';
import { AccountActionsComponent } from '../account-actions-component/account-actions-component';

@Component({
  selector: 'app-admin-settings-page-component',
  imports: [
    MatTabsModule,
    ProfileSettingsComponent,
    AccountActionsComponent
  ],
  templateUrl: './admin-settings-page-component.html',
  styleUrl: './admin-settings-page-component.css',
})
export class AdminSettingsPageComponent {

}
