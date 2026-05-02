import { Component } from '@angular/core';
import { DailyListFormComponent } from './daily-list-form-component/daily-list-form-component';
import { DailyFoodListFormComponent } from '../daily-food-list-form-component/daily-food-list-form-component';
import { SingleEntryFormComponent } from './single-entry-form-component/single-entry-form-component';

@Component({
  selector: 'app-user-dashboard-component',
  imports: [
    DailyListFormComponent,
    DailyFoodListFormComponent,
    SingleEntryFormComponent
  ],
  templateUrl: './user-dashboard-component.html',
  styleUrl: './user-dashboard-component.css',
})
export class UserDashboardComponent {

}
