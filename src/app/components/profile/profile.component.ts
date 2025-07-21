import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { User } from '../../models/user.model';
import { Permission } from '../../models/permission.model';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HasPermissionDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isEditing = false;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Permission flags
  canViewProfile = false;
  canEditProfile = false;
  canEditPermissions = false;
  
  // Permission enums for template
  Permission = Permission;
  
  // Permission details for UI
  grantedPermissionDetails: Array<{
    permission: Permission;
    displayName: string;
    badgeColor: string;
  }> = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Subscribe to user changes
    const userSub = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          address: user.address
        });
      } else {
        this.router.navigate(['/login']);
      }
    });

    // Subscribe to permission changes
    const permissionSub = this.permissionService.currentPermissions$.subscribe(() => {
      this.updatePermissions();
    });

    this.subscriptions.push(userSub, permissionSub);

    // Initial permission check
    this.updatePermissions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updatePermissions(): void {
    this.canViewProfile = this.permissionService.canViewProfile();
    this.canEditProfile = this.permissionService.canEditProfile();
    this.canEditPermissions = this.permissionService.canEditPermissions();
    this.grantedPermissionDetails = this.permissionService.getGrantedPermissionDetails();

    // If user doesn't have view permission, redirect to dashboard
    if (!this.canViewProfile && this.currentUser) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  toggleEdit(): void {
    // Check if user has edit permission
    if (!this.canEditProfile) {
      this.message = 'You do not have permission to edit profile';
      this.messageType = 'error';
      return;
    }

    this.isEditing = !this.isEditing;
    this.message = '';
    
    if (!this.isEditing && this.currentUser) {
      // Reset form to original values if canceling edit
      this.profileForm.patchValue({
        name: this.currentUser.name,
        address: this.currentUser.address
      });
    }
  }

  onSubmit(): void {
    // Double-check edit permission before submitting
    if (!this.canEditProfile) {
      this.message = 'You do not have permission to edit profile';
      this.messageType = 'error';
      return;
    }

    if (this.profileForm.valid) {
      this.isLoading = true;
      this.message = '';

      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.message = response.message;
            this.messageType = 'success';
            this.isEditing = false;
          } else {
            this.message = response.message;
            this.messageType = 'error';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.message = 'An error occurred while updating profile';
          this.messageType = 'error';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // Helper method to check if user has specific permission
  hasPermission(permission: Permission): boolean {
    return this.permissionService.hasPermission(permission);
  }

  // Get all available permissions for current role (for admin section)
  getAllPermissions(): Array<{
    permission: Permission;
    displayName: string;
    granted: boolean;
    badgeColor: string;
  }> {
    return this.permissionService.getPermissionDetails();
  }
}

