import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformServer } from '@angular/common';
import { MeasurementCategoryService } from '../../measurement-category.service';
import { DailyListService } from '../../daily-list.service';
import { MeasurementService } from '../../measurement.service';
import { MeasurementCategory } from '../../models/measurement-category.model';
import { DailyList } from '../../models/daily-list.model';
import { Measurement } from '../../models/measurement.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-daily-list-form-component',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './daily-list-form-component.html',
  styleUrl: './daily-list-form-component.css',
})
export class DailyListFormComponent implements OnInit, OnDestroy {
  categories: MeasurementCategory[] = [];
  selectedCategories: MeasurementCategory[] = [];
  measurements: { [categoryId: string]: number | string } = {};
  existingMeasurementIds: { [categoryId: string]: string } = {};
  loading = false;
  isLoading = false;

  constructor(
    private categoryService: MeasurementCategoryService,
    private dailyListService: DailyListService,
    private measurementService: MeasurementService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Skip HTTP calls during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.loadDashboardData();
  }

  ngOnDestroy() {
    // No cleanup needed
  }

  loadDashboardData() {
    this.loading = true;

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        const todayRange = this.getTodayRange();

        forkJoin({
          dailyList: this.dailyListService.getDailyList().pipe(catchError(() => of(null))),
          measurements: this.measurementService.getMeasurements(undefined, todayRange.start, todayRange.end).pipe(catchError(() => of([] as Measurement[])))
        }).subscribe({
          next: ({ dailyList, measurements }) => {
            this.zone.run(() => {
              const categoryMap = new Map(this.categories.map(category => [category._id, category]));
              const selectedCategoryIds = this.extractCategoryIds(dailyList);

              this.selectedCategories = selectedCategoryIds
                .map(categoryId => categoryMap.get(categoryId))
                .filter((category): category is MeasurementCategory => Boolean(category));

              this.measurements = {};
              this.existingMeasurementIds = {};
              measurements.forEach(measurement => {
                const categoryId = this.getMeasurementCategoryId(measurement);
                if (categoryId && selectedCategoryIds.includes(categoryId)) {
                  this.measurements[categoryId] = measurement.value;
                  this.existingMeasurementIds[categoryId] = measurement._id;
                }
              });

              this.loading = false;
              this.cdr.detectChanges();
            });
          },
          error: (error) => {
            this.zone.run(() => {
              console.error('Error loading dashboard measurements:', error);
              this.loading = false;
              this.cdr.detectChanges();
            });
          }
        });
      },
      error: (error) => {
        this.zone.run(() => {
          this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  submitMeasurements() {
    if (this.selectedCategories.length === 0) {
      this.snackBar.open('No categories selected for daily tracking', 'Close', { duration: 3000 });
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const entries = this.selectedCategories
      .map(cat => ({
        categoryId: cat._id,
        value: Number(this.measurements[cat._id]),
        unit: cat.unit,
        date: currentDate
      }))
      .filter(entry => Number.isFinite(entry.value));

    if (entries.length === 0) {
      this.snackBar.open('Please enter at least one measurement value', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    // Submit all measurements
    const requests = entries.map(entry =>
      this.existingMeasurementIds[entry.categoryId]
        ? this.measurementService.updateMeasurement(this.existingMeasurementIds[entry.categoryId], {
            categoryId: entry.categoryId,
            value: entry.value,
            date: entry.date
          })
        : this.measurementService.createMeasurement(entry)
    );

    // Use forkJoin to wait for all requests to complete
    forkJoin(requests).pipe(
      finalize(() => {
        this.zone.run(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Measurements saved successfully!', 'Close', { duration: 3000 });
        this.loadDashboardData();
      },
      error: (error) => {
        console.error('Error saving measurements:', error);
        this.snackBar.open('Failed to save measurements', 'Close', { duration: 3000 });
      }
    });
  }

  isSelected(categoryId: string): boolean {
    return this.selectedCategories.some(cat => cat._id === categoryId);
  }

  private getTodayRange() {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  }

  private extractCategoryIds(dailyList: DailyList | null): string[] {
    if (!dailyList) {
      return [];
    }

    return (dailyList.categories as Array<string | MeasurementCategory>)
      .map(category => typeof category === 'string' ? category : category._id)
      .filter((categoryId): categoryId is string => Boolean(categoryId));
  }

  private getMeasurementCategoryId(measurement: Measurement): string {
    const category = measurement.categoryId as string | MeasurementCategory | undefined;

    if (!category) {
      return '';
    }

    return typeof category === 'string' ? category : category._id;
  }
}