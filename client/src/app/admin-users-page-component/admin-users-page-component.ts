import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformServer } from '@angular/common';
import { UserSearchComponent } from './user-search-component/user-search-component';
import { UserTableComponent } from './user-table-component/user-table-component';
import { UserModalComponent } from './user-modal-component/user-modal-component';
import { User } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-users-page-component',
  imports: [
    CommonModule,
    UserSearchComponent,
    UserTableComponent,
    UserModalComponent
  ],
  templateUrl: './admin-users-page-component.html',
  styleUrl: './admin-users-page-component.css',
})
export class AdminUsersPageComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  showModal = false;
  selectedUser: User | null = null;
  loading = false;

  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Skip HTTP calls during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  onSearch(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
  }

  onEditUser(user: User) {
    this.selectedUser = { ...user };
    this.showModal = true;
  }

  onDeleteUser(user: User) {
    if (user.role === 'admin') {
      alert('Cannot delete admin users.');
      return;
    }
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      });
    }
  }

  onSaveUser(updatedUser: User) {
    this.userService.updateUser(updatedUser.id, updatedUser).subscribe({
      next: () => {
        this.loadUsers(); // Reload the list
        this.showModal = false;
        this.selectedUser = null;
      },
      error: (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user');
      }
    });
  }

  onCancelEdit() {
    this.showModal = false;
    this.selectedUser = null;
  }
}
