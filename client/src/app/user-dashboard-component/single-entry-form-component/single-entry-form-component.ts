import { ChangeDetectorRef, Component, NgZone, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformServer } from '@angular/common';
import { MeasurementCategoryService } from '../../measurement-category.service';
import { DailyListService } from '../../daily-list.service';
import { MeasurementService } from '../../measurement.service';
import { MeasurementCategory } from '../../models/measurement-category.model';
import { DailyList } from '../../models/daily-list.model';
import { Measurement } from '../../models/measurement.model';
import { forkJoin, firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-single-entry-form-component',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, FormsModule, MatIconModule],
  templateUrl: './single-entry-form-component.html',
  styleUrls: ['./single-entry-form-component.css'],
})
export class SingleEntryFormComponent implements OnInit {
  categories: MeasurementCategory[] = [];
  entries: Array<{ measurementId?: string; categoryName: string; value: number; unit: string; date?: string }> = [
    { categoryName: '', value: 0, unit: '' }
  ];
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

    setTimeout(() => this.loadDashboardData(), 0);
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
              const dailyCategoryIds = new Set(this.extractCategoryIds(dailyList));

              const additionalMeasurements = measurements.filter(measurement => {
                const categoryId = this.getMeasurementCategoryId(measurement);
                return categoryId && !dailyCategoryIds.has(categoryId);
              });

              this.entries = additionalMeasurements.length > 0
                ? additionalMeasurements.map(measurement => ({
                    measurementId: measurement._id,
                    categoryName: this.getMeasurementCategoryName(measurement),
                    value: measurement.value,
                    unit: measurement.unit || this.getCategoryUnit(this.getMeasurementCategoryId(measurement)),
                    date: typeof measurement.date === 'string' ? measurement.date : new Date(measurement.date).toISOString()
                  }))
                : [{ categoryName: '', value: 0, unit: '' }];

              this.loading = false;
              this.cdr.detectChanges();
            });
          },
          error: (error) => {
            this.zone.run(() => {
              console.error('Error loading additional measurements:', error);
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

  addRow() {
    this.entries.push({ categoryName: '', value: 0, unit: '' });
  }

  saveEntries() {
    this.saveValidEntries();
  }

  deleteRow(index: number) {
    const entry = this.entries[index];

    if (!entry) {
      return;
    }

    if (!entry.measurementId) {
      this.entries.splice(index, 1);
      if (this.entries.length === 0) {
        this.entries = [{ categoryName: '', value: 0, unit: '' }];
      }
      return;
    }

    this.isLoading = true;
    this.measurementService.deleteMeasurement(entry.measurementId).subscribe({
      next: () => {
        this.entries.splice(index, 1);
        if (this.entries.length === 0) {
          this.entries = [{ categoryName: '', value: 0, unit: '' }];
        }
        this.isLoading = false;
        this.snackBar.open('Additional measurement removed', 'Close', { duration: 2500 });
      },
      error: (error) => {
        console.error('Error deleting additional measurement:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to remove measurement', 'Close', { duration: 3000 });
      }
    });
  }

  private saveValidEntries() {
    if (this.isLoading) {
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const validEntries = this.entries.filter(entry => entry.categoryName && entry.value !== null && entry.value !== undefined && entry.unit);

    if (validEntries.length === 0) {
      this.snackBar.open('Please fill in category, value and unit before saving', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    const saveRequests = validEntries.map(entry => this.resolveCategoryId(entry.categoryName, entry.unit).then(categoryId => {
      const payload = {
        categoryId,
        value: Number(entry.value),
        date: currentDate,
        unit: entry.unit.trim()
      };

      return entry.measurementId
        ? this.measurementService.updateMeasurement(entry.measurementId, payload)
        : this.measurementService.createMeasurement(payload);
    }));

    Promise.all(saveRequests)
      .then(requests => forkJoin(requests).subscribe({
        next: (savedMeasurements) => {
          this.zone.run(() => {
            savedMeasurements.forEach((savedMeasurement, index) => {
              validEntries[index].measurementId = savedMeasurement._id;
            });
            this.isLoading = false;
            this.snackBar.open('Measurements saved successfully!', 'Close', { duration: 3000 });
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          this.zone.run(() => {
            console.error('Error saving additional measurements:', error);
            this.isLoading = false;
            this.snackBar.open('Failed to save measurements', 'Close', { duration: 3000 });
            this.cdr.detectChanges();
          });
        }
      }))
      .catch(error => {
        console.error('Error resolving categories for additional measurements:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to resolve measurement category', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      });
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

  private getMeasurementCategoryName(measurement: Measurement): string {
    const category = measurement.categoryId as string | MeasurementCategory | undefined;

    if (!category) {
      return '';
    }

    return typeof category === 'string'
      ? this.categories.find(existingCategory => existingCategory._id === category)?.name || ''
      : category.name;
  }

  private getCategoryUnit(categoryId: string): string {
    return this.categories.find(category => category._id === categoryId)?.unit || '';
  }

  private async resolveCategoryId(categoryName: string, unit: string): Promise<string> {
    const normalizedName = categoryName.trim().toLowerCase();
    const existingCategory = this.categories.find(category => category.name.trim().toLowerCase() === normalizedName);

    if (existingCategory) {
      return existingCategory._id;
    }

    const createdCategory = await firstValueFrom(this.categoryService.createCategory({
      name: categoryName.trim(),
      unit: unit.trim()
    }));

    if (!createdCategory) {
      throw new Error('Category creation failed');
    }

    this.categories = [...this.categories, createdCategory];
    return createdCategory._id;
  }
}
