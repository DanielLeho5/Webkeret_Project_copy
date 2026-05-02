import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { isPlatformServer } from '@angular/common';
import { MeasurementService } from '../measurement.service';
import { DailyFoodListService } from '../daily-food-list.service';
import { MeasurementCategoryService } from '../measurement-category.service';
import { Measurement, MeasurementCategory } from '../models/measurement.model';
import { DailyFoodList } from '../models/daily-food-list.model';
import { forkJoin } from 'rxjs';

interface HealthData {
  date: string;
  category: string;
  value: string;
}

@Component({
  selector: 'app-export-data-component',
  imports: [FormsModule, MatIconModule, CommonModule],
  templateUrl: './export-data-component.html',
  styleUrl: './export-data-component.css',
})
export class ExportDataComponent implements OnInit {
  exportFormat: 'csv' | 'json' = 'csv';
  startDate: string = '';
  endDate: string = '';
  availableCategories: MeasurementCategory[] = [];
  selectedCategories: string[] = []; // category IDs
  loading = false;

  constructor(
    private measurementService: MeasurementService,
    private dailyFoodListService: DailyFoodListService,
    private measurementCategoryService: MeasurementCategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.endDate = today.toISOString().split('T')[0];
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];

    // Skip HTTP calls during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.loadCategories();
  }

  private loadCategories() {
    this.measurementCategoryService.getCategories().subscribe({
      next: (categories) => {
        setTimeout(() => {
          this.availableCategories = categories;
          // Select all categories by default
          this.selectedCategories = categories.map(cat => cat._id);
        }, 0);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  exportData() {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (this.selectedCategories.length === 0) {
      alert('Please select at least one category to export.');
      return;
    }

    this.loading = true;

    // Fetch real data from APIs
    forkJoin({
      measurements: this.measurementService.getMeasurements(this.selectedCategories.join(','), this.startDate, this.endDate),
      dailyFoodLists: this.dailyFoodListService.getDailyFoodLists(this.startDate, this.endDate)
    }).subscribe({
      next: ({ measurements, dailyFoodLists }) => {
        const exportData = this.prepareExportData(measurements, dailyFoodLists);
        this.performExport(exportData);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data for export:', error);
        alert('Failed to fetch data for export');
        this.loading = false;
      }
    });
  }

  private prepareExportData(measurements: Measurement[], dailyFoodLists: DailyFoodList[]): HealthData[] {
    const data: HealthData[] = [];

    // Add measurements
    measurements.forEach(measurement => {
      data.push({
        date: new Date(measurement.date).toISOString().split('T')[0],
        category: measurement.category?.name || 'Unknown',
        value: `${measurement.value} ${measurement.category?.unit || ''}`.trim()
      });
    });

    // Add food summaries
    dailyFoodLists.forEach(dailyFoodList => {
      const totalCalories = dailyFoodList.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
      const totalProtein = dailyFoodList.foods.reduce((sum, food) => sum + (food.protein || 0), 0);
      const totalCarbs = dailyFoodList.foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
      const totalFat = dailyFoodList.foods.reduce((sum, food) => sum + (food.fat || 0), 0);

      data.push({
        date: new Date(dailyFoodList.date).toISOString().split('T')[0],
        category: 'Food Summary',
        value: `Calories: ${totalCalories}, Protein: ${totalProtein}g, Carbs: ${totalCarbs}g, Fat: ${totalFat}g`
      });
    });

    return data.sort((a, b) => a.date.localeCompare(b.date));
  }

  private performExport(data: HealthData[]) {
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (this.exportFormat === 'csv') {
      content = this.convertToCSV(data);
      mimeType = 'text/csv';
      fileExtension = 'csv';
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }

    this.downloadFile(content, `health-data.${fileExtension}`, mimeType);
  }

  isSelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  toggleCategory(categoryId: string): void {
    if (this.isSelected(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== categoryId);
    } else {
      this.selectedCategories = [...this.selectedCategories, categoryId];
    }
  }

  isAllSelected(): boolean {
    return this.selectedCategories.length === this.availableCategories.length;
  }

  isIndeterminate(): boolean {
    return this.selectedCategories.length > 0 && this.selectedCategories.length < this.availableCategories.length;
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedCategories = [];
    } else {
      this.selectedCategories = this.availableCategories.map(cat => cat._id);
    }
  }

  private convertToCSV(data: HealthData[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row).map(value =>
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
