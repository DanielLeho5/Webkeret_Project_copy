import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-modal-component',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-modal-component.html',
  styleUrl: './user-modal-component.css',
})
export class UserModalComponent implements OnChanges {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  editedUser: User = {
    id: '',
    name: '',
    email: '',
    role: 'user'
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.editedUser = { ...this.user };
    }
  }

  onSave() {
    this.save.emit(this.editedUser);
  }

  onCancel() {
    this.cancel.emit();
  }
}
