import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isPlatformServer } from '@angular/common';
import { UserService } from '../user.service';

interface UserProfile {
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string; // For password changes
}

@Component({
  selector: 'app-profile-settings-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-settings-component.html',
  styleUrl: './profile-settings-component.css',
})
export class ProfileSettingsComponent implements OnInit {
  profile: UserProfile = {
    name: '',
    email: '',
    role: 'user',
    password: ''
  };
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

    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (currentUser) => {
        setTimeout(() => {
          this.profile = {
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            password: ''
          };
          this.loading = false;
        }, 0);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        setTimeout(() => {
          this.loading = false;
        }, 0);
      }
    });
  }

  onSave() {
    if (this.profile.name && this.profile.email) {
      this.loading = true;

      const updateData = {
        name: this.profile.name,
        email: this.profile.email,
        role: this.profile.role
      };

      this.userService.updateUser('me', updateData).subscribe({
        next: () => {
          alert('Profile updated successfully!');
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Failed to update profile');
          this.loading = false;
        },
      });
    }
  }
}
