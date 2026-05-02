import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-search-component',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './user-search-component.html',
  styleUrl: './user-search-component.css',
})
export class UserSearchComponent {
  @Output() search = new EventEmitter<string>();

  searchTerm = '';

  onSearchChange() {
    this.search.emit(this.searchTerm);
  }
}
