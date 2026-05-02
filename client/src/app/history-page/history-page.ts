import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformServer } from '@angular/common';
import { HistoryFilterComponent } from './history-filter-component/history-filter-component';
import { HistoryTableComponent } from './history-table-component/history-table-component';
import { FoodSummaryModalComponent } from './food-summary-modal-component/food-summary-modal-component';
import { FoodSummary, HistoryRow } from './history.types';
import { MeasurementService } from '../measurement.service';
import { DailyFoodListService } from '../daily-food-list.service';
import { MeasurementCategoryService } from '../measurement-category.service';
import { BehaviorSubject, forkJoin, of, Observable } from 'rxjs';
import { catchError, defaultIfEmpty, map, shareReplay, switchMap } from 'rxjs/operators';
import { Measurement } from '../models/measurement.model';
import { MeasurementCategory } from '../models/measurement-category.model';
import { DailyFoodList } from '../models/daily-food-list.model';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [CommonModule, HistoryFilterComponent, HistoryTableComponent, FoodSummaryModalComponent],
  templateUrl: './history-page.html',
  styleUrls: ['./history-page.css'],
})
export class HistoryPage {
  activeFoodSummary: FoodSummary | null = null;
  categories$!: Observable<MeasurementCategory[]>;
  filteredData$!: Observable<HistoryRow[]>;
  selectedCategory = 'all';

  private filterSubject = new BehaviorSubject<{ fromDate: string; toDate: string; category: string }>({
    fromDate: '',
    toDate: '',
    category: 'all'
  });

  private historyRows$!: Observable<HistoryRow[]>;

  constructor(
    private measurementService: MeasurementService,
    private dailyFoodListService: DailyFoodListService,
    private measurementCategoryService: MeasurementCategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      this.categories$ = of([] as MeasurementCategory[]);
      this.historyRows$ = of([] as HistoryRow[]);
      this.filteredData$ = of([] as HistoryRow[]);
      return;
    }

    this.categories$ = this.measurementCategoryService.getCategories().pipe(
      catchError((error) => {
        console.error('Error loading categories:', error);
        return of([] as MeasurementCategory[]);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.historyRows$ = this.createHistoryRowsStream();
    this.filteredData$ = this.historyRows$.pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private createHistoryRowsStream() {
    return this.filterSubject.pipe(
      switchMap((filter) => {
        return forkJoin({
          measurements: this.measurementService.getMeasurements(undefined, filter.fromDate, filter.toDate).pipe(
            defaultIfEmpty([] as Measurement[]),
            catchError((error) => {
              console.error('Error loading measurements:', error);
              return of([] as Measurement[]);
            })
          ),
          dailyFoodLists: this.dailyFoodListService.getDailyFoodLists(filter.fromDate, filter.toDate).pipe(
            defaultIfEmpty([] as DailyFoodList[]),
            catchError((error) => {
              console.error('Error loading daily food lists:', error);
              return of([] as DailyFoodList[]);
            })
          )
        }).pipe(
          map(({ measurements, dailyFoodLists }) => this.transformDataToHistoryRows(measurements, dailyFoodLists))
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private transformDataToHistoryRows(measurements: Measurement[], dailyFoodLists: DailyFoodList[]): HistoryRow[] {
    const dateMap = new Map<string, HistoryRow>();

    // Group measurements by date
    measurements.forEach(measurement => {
      const dateStr = new Date(measurement.date).toISOString().split('T')[0];
      
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          measurements: {},
          foodSummary: {
            date: dateStr,
            foods: [],
            totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
          }
        });
      }

      const row = dateMap.get(dateStr)!;
      this.setMeasurementValue(row, measurement);
    });

    // Add food summaries
    dailyFoodLists.forEach(dailyFoodList => {
      const dateStr = new Date(dailyFoodList.date).toISOString().split('T')[0];
      
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          measurements: {},
          foodSummary: {
            date: dateStr,
            foods: [],
            totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
          }
        });
      }

      const row = dateMap.get(dateStr)!;
      this.setFoodSummary(row, dailyFoodList);
    });

    // Sort by date descending
    return Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  }

  private setMeasurementValue(row: HistoryRow, measurement: Measurement) {
    const categoryId = this.getMeasurementCategoryId(measurement);
    const value = measurement.value;
    const unit = measurement.category?.unit || '';
    const displayValue = unit ? `${value} ${unit}` : `${value}`;

    if (categoryId) {
      row.measurements[categoryId] = displayValue;
    }
  }

  private getMeasurementCategoryId(measurement: Measurement): string {
    const category = measurement.categoryId as string | MeasurementCategory | undefined;

    if (!category) {
      return '';
    }

    return typeof category === 'string' ? category : category._id;
  }

  private setFoodSummary(row: HistoryRow, dailyFoodList: DailyFoodList) {
    const foods = dailyFoodList.foods.map(food => ({
      name: food.name,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0
    }));

    const totals = foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    row.foodSummary = {
      date: row.date,
      foods,
      totals
    };
  }

  onFilterChange(filter: { fromDate: string; toDate: string; category: string }) {
    this.selectedCategory = filter.category;
    this.filterSubject.next(filter);
  }

  openFoodSummary(summary: FoodSummary) {
    this.activeFoodSummary = summary;
  }

  closeFoodSummary() {
    this.activeFoodSummary = null;
  }
}
