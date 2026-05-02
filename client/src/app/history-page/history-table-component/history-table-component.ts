import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HistoryRow, FoodSummary } from '../history.types';
import { MeasurementCategory } from '../../models/measurement-category.model';

@Component({
  selector: 'app-history-table-component',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './history-table-component.html',
  styleUrls: ['./history-table-component.css'],
})
export class HistoryTableComponent {
  @Input() categories: MeasurementCategory[] = [];
  @Input() dataSource: HistoryRow[] = [];
  @Input() selectedCategory = 'all';
  @Output() foodSummaryRequested = new EventEmitter<FoodSummary>();

  get visibleCategories(): MeasurementCategory[] {
    if (this.selectedCategory === 'all') {
      return this.categories;
    }

    return this.categories.filter((category) => category._id === this.selectedCategory);
  }

  onFoodSummary(row: HistoryRow) {
    this.foodSummaryRequested.emit(row.foodSummary);
  }
}
