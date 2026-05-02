import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeasurementCategory } from '../../models/measurement-category.model';

@Component({
  selector: 'app-history-filter-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history-filter-component.html',
  styleUrl: './history-filter-component.css',
})
export class HistoryFilterComponent {
  @Output() filterChange = new EventEmitter<{ fromDate: string; toDate: string; category: string }>();
  @Input() categories: MeasurementCategory[] = [];

  fromDate = '';
  toDate = '';
  category = 'all';

  emitChange() {
    this.filterChange.emit({
      fromDate: this.fromDate,
      toDate: this.toDate,
      category: this.category,
    });
  }

  resetFilters() {
    this.fromDate = '';
    this.toDate = '';
    this.category = 'all';
    this.emitChange();
  }
}
