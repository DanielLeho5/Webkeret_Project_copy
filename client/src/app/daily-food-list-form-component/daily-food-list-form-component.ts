import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformServer } from '@angular/common';
import { DailyFoodListService } from '../daily-food-list.service';
import { FoodItem, DailyFoodList } from '../models/daily-food-list.model';

@Component({
  selector: 'app-daily-food-list-form-component',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './daily-food-list-form-component.html',
  styleUrl: './daily-food-list-form-component.css',
})
export class DailyFoodListFormComponent implements OnInit {
  foodItems: FoodItem[] = [];
  currentFoodListId: string | null = null;
  newFoodItem: Partial<FoodItem> = {
    name: '',
    quantity: 0,
    unit: 'g',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  isLoading = false;
  currentDate = new Date().toISOString().split('T')[0];

  commonUnits = ['g', 'kg', 'ml', 'l', 'pieces', 'cups'];

  constructor(
    private dailyFoodListService: DailyFoodListService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Skip HTTP calls during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.loadFoodItems();
  }

  private loadFoodItems() {
    this.dailyFoodListService.getDailyFoodLists(this.currentDate, this.currentDate).subscribe({
      next: (lists) => {
        if (lists.length > 0) {
          this.currentFoodListId = lists[0].id || (lists[0] as any)._id || null;
          this.foodItems = lists[0].foods || [];
        } else {
          this.currentFoodListId = null;
          this.foodItems = [];
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to load food items', 'Close', { duration: 3000 });
        this.currentFoodListId = null;
        this.foodItems = [];
      }
    });
  }

  addFoodItem() {
    if (this.newFoodItem.name?.trim() && this.newFoodItem.quantity && this.newFoodItem.quantity > 0) {
      const foodItem: FoodItem = {
        id: Date.now().toString(), // Temporary ID generation
        name: this.newFoodItem.name.trim(),
        quantity: Number(this.newFoodItem.quantity),
        unit: this.newFoodItem.unit || 'g',
        calories: Number(this.newFoodItem.calories || 0),
        protein: Number(this.newFoodItem.protein || 0),
        carbs: Number(this.newFoodItem.carbs || 0),
        fat: Number(this.newFoodItem.fat || 0)
      };

      this.foodItems.push(foodItem);
      this.resetNewFoodItem();
      this.saveFoodList();
    }
  }

  removeFoodItem(index: number) {
    this.foodItems.splice(index, 1);
    this.saveFoodList();
  }

  private resetNewFoodItem() {
    this.newFoodItem = {
      name: '',
      quantity: 0,
      unit: 'g',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
  }

  saveFoodList() {
    this.isLoading = true;
    const dailyFoodList = {
      date: this.currentDate,
      foods: this.foodItems.map((food) => ({
        ...food,
        quantity: Number(food.quantity),
        calories: food.calories != null ? Number(food.calories) : undefined,
        protein: food.protein != null ? Number(food.protein) : undefined,
        carbs: food.carbs != null ? Number(food.carbs) : undefined,
        fat: food.fat != null ? Number(food.fat) : undefined
      }))
    };

    const request = this.currentFoodListId
      ? this.dailyFoodListService.updateDailyFoodList(this.currentFoodListId, dailyFoodList)
      : this.dailyFoodListService.createDailyFoodList(dailyFoodList);

    request.subscribe({
      next: (savedList) => {
        this.currentFoodListId = savedList.id || (savedList as any)._id || this.currentFoodListId;
        this.isLoading = false;
        this.snackBar.open('Daily food list saved', 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to save food list', 'Close', { duration: 3000 });
      }
    });
  }

  getTotalNutrition() {
    return this.foodItems.reduce((totals, item) => ({
      calories: totals.calories + (item.calories || 0),
      protein: totals.protein + (item.protein || 0),
      carbs: totals.carbs + (item.carbs || 0),
      fat: totals.fat + (item.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }
}
