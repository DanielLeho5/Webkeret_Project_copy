import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodSummary } from '../history.types';

@Component({
  selector: 'app-food-summary-modal-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-summary-modal-component.html',
  styleUrl: './food-summary-modal-component.css',
})
export class FoodSummaryModalComponent {
  @Input() summary: FoodSummary | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
