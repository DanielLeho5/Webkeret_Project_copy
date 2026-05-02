import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileSettingsComponent } from '../profile-settings-component/profile-settings-component';
import { DailyListSettingsComponent } from '../daily-list-settings-component/daily-list-settings-component';
import { ExportDataComponent } from '../export-data-component/export-data-component';
import { AccountActionsComponent } from '../account-actions-component/account-actions-component';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [
    MatTabsModule,
    ProfileSettingsComponent,
    DailyListSettingsComponent,
    ExportDataComponent,
    AccountActionsComponent
  ],
  templateUrl: './setting-page.html',
  styleUrl: './setting-page.css',
})
export class SettingPage {

}
