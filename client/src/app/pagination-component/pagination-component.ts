import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  standalone: true,
  imports: [],
  templateUrl: './pagination-component.html',
  styleUrl: './pagination-component.css',
})
export class PaginationComponent {
  currentPage = 1;
  totalPages = 5;

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }
}
