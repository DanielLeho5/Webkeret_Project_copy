import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { isPlatformServer } from '@angular/common';
import { DailyListService } from '../daily-list.service';
import { MeasurementCategoryService } from '../measurement-category.service';
import { MeasurementCategory } from '../models/measurement-category.model';

@Component({
  selector: 'app-daily-list-settings-component',
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './daily-list-settings-component.html',
  styleUrl: './daily-list-settings-component.css',
})
export class DailyListSettingsComponent implements OnInit {
  selectedCategories: MeasurementCategory[] = [];
  availableCategories: MeasurementCategory[] = [];
  newCategoryName: string = '';
  newCategoryUnit: string = '';
  loading = false;

  constructor(
    private dailyListService: DailyListService,
    private measurementCategoryService: MeasurementCategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Skip HTTP calls during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.loadCategories();
  }

  private loadCategories() {
    this.loading = true;
    
    // Load available categories and current daily list
    this.measurementCategoryService.getCategories().subscribe({
      next: (categories) => {
        setTimeout(() => {
          this.availableCategories = categories;
        }, 0);
        
        // Load current daily list settings
        this.dailyListService.getDailyList().subscribe({
          next: (dailyList) => {
            // Filter available categories to only show selected ones
            // dailyList.categories contains populated category objects
            const selectedCategoryIds = dailyList.categories.map((cat: any) => cat._id);
            setTimeout(() => {
              this.selectedCategories = this.availableCategories.filter(cat => 
                selectedCategoryIds.includes(cat._id)
              );
              this.loading = false;
            }, 0);
          },
          error: (error) => {
            console.error('Error loading daily list:', error);
            setTimeout(() => {
              this.loading = false;
            }, 0);
          }
        });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        setTimeout(() => {
          this.loading = false;
        }, 0);
      }
    });
  }

  drop(event: CdkDragDrop<MeasurementCategory[]>) {
    moveItemInArray(this.selectedCategories, event.previousIndex, event.currentIndex);
  }

  addCategory() {
    if (this.newCategoryName.trim() && this.newCategoryUnit.trim()) {
      const categoryName = this.newCategoryName.trim();
      const categoryUnit = this.newCategoryUnit.trim();
      const existingCategory = this.availableCategories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (existingCategory) {
        if (!this.selectedCategories.find(cat => cat._id === existingCategory._id)) {
          this.selectedCategories.push(existingCategory);
          this.newCategoryName = '';
          this.newCategoryUnit = '';
        } else {
          alert('Category already selected!');
        }
      } else {
        // Create new category
        this.measurementCategoryService.createCategory({ name: categoryName, unit: categoryUnit }).subscribe({
          next: (newCategory) => {
            this.availableCategories.push(newCategory);
            this.selectedCategories.push(newCategory);
            this.newCategoryName = '';
            this.newCategoryUnit = '';
          },
          error: (error) => {
            console.error('Error creating category:', error);
            alert(`Failed to create category: ${error.message || 'Unknown error'}`);
          }
        });
      }
    } else {
      alert('Please enter both category name and unit');
    }
  }

  removeCategory(index: number) {
    this.selectedCategories.splice(index, 1);
  }

  saveSettings() {
    const categoryIds = this.selectedCategories.map(cat => cat._id);
    
    this.dailyListService.updateDailyList({ categories: categoryIds }).subscribe({
      next: () => {
        alert('Daily list settings saved successfully!');
      },
      error: (error) => {
        console.error('Error saving settings:', error);
        alert('Failed to save settings');
      }
    });
  }
}
