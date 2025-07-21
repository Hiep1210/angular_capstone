import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { MockDataService } from '../../services/mock-data.service';
import { User } from '../../models/user.model';
import { Permission, PermissionDetail } from '../../models/permission.model';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  allUsers: User[] = [];
  userStats = {
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  };

  // Permission Editor
  showPermissionEditor = false;
  selectedUser: User | null = null;
  selectedUserPermissions: Permission[] = [];

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
    private authService: AuthService,
    private permissionService: PermissionService,
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    const userSub = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.loadDashboardData();
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
  }

  loadDashboardData(): void {
    if (this.currentUser?.role === 'admin') {
      this.allUsers = this.mockDataService.getUsers();
      this.calculateStats();
    }
  }

  calculateStats(): void {
    this.userStats.totalUsers = this.allUsers.length;
    this.userStats.adminUsers = this.allUsers.filter(user => user.role === 'admin').length;
    this.userStats.regularUsers = this.allUsers.filter(user => user.role === 'user').length;
  }

  // Permission Editor Methods
  openPermissionEditor(user: User): void {
    if (!this.canEditPermissions) {
      console.warn('User does not have permission to edit permissions');
      return;
    }
    
    this.selectedUser = user;
    this.selectedUserPermissions = [...(user.permissions || [])];
    this.showPermissionEditor = true;
  }

  closePermissionEditor(): void {
    this.showPermissionEditor = false;
    this.selectedUser = null;
    this.selectedUserPermissions = [];
  }

  togglePermission(permission: Permission, event: any): void {
    if (event.target.checked) {
      if (!this.selectedUserPermissions.includes(permission)) {
        this.selectedUserPermissions.push(permission);
      }
    } else {
      this.selectedUserPermissions = this.selectedUserPermissions.filter(p => p !== permission);
    }
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.selectedUserPermissions.includes(permission);
  }

  savePermissions(): void {
    if (this.selectedUser) {
      const success = this.mockDataService.updateUserPermissions(
        this.selectedUser.username, 
        this.selectedUserPermissions
      );
      
      if (success) {
        // Update the local user object
        this.selectedUser.permissions = [...this.selectedUserPermissions];
        
        // Refresh the user list
        this.loadDashboardData();
        
        // Close the editor
        this.closePermissionEditor();
        
        console.log('Permissions updated successfully');
      } else {
        console.error('Failed to update permissions');
      }
    }
  }

  // Helper methods for template
  getUserPermissionDetails(user: User): PermissionDetail[] {
    if (!user.permissions) return [];
    return this.permissionService.getPermissionDetailsByPermissions(user.permissions);
  }

  getAllPermissionDetails(): PermissionDetail[] {
    return this.permissionService.getAllPermissionDetails();
  }

  getSelectedPermissionDetails(): PermissionDetail[] {
    return this.permissionService.getPermissionDetailsByPermissions(this.selectedUserPermissions);
  }

  navigateToProfile(): void {
    // Check if user has permission to view profile
    if (this.canViewProfile) {
      this.router.navigate(['/profile']);
    } else {
      console.warn('User does not have permission to view profile');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentTime(): string {
    return new Date().toLocaleString();
  }

  // Helper method to check if user has specific permission
  hasPermission(permission: Permission): boolean {
    return this.permissionService.hasPermission(permission);
  }

  // Get available actions based on permissions
  getAvailableActions(): Array<{
    name: string;
    action: () => void;
    enabled: boolean;
    permission: Permission;
  }> {
    return [
      {
        name: 'View Profile',
        action: () => this.navigateToProfile(),
        enabled: this.canViewProfile,
        permission: Permission.VIEW_PROFILE
      },
      {
        name: 'Edit Profile',
        action: () => this.navigateToProfile(),
        enabled: this.canEditProfile,
        permission: Permission.EDIT_PROFILE
      }
    ];
  }

  // Get permission status for debugging
  getPermissionStatus() {
    return this.permissionService.getPermissionStatus();
  }
}

