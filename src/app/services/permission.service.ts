import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Permission, 
  PermissionDetail,
  UserPermissions, 
  getPermissionsForRole, 
  getPermissionDisplayName,
  getPermissionBadgeColor 
} from '../models/permission.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private currentPermissionsSubject = new BehaviorSubject<UserPermissions>({
    [Permission.VIEW_PROFILE]: false,
    [Permission.EDIT_PROFILE]: false,
    [Permission.EDIT_PERMISSION]: false
  });

  public currentPermissions$ = this.currentPermissionsSubject.asObservable();

  constructor() {}

  // Update permissions based on user role
  updatePermissions(user: User | null): void {
    if (user && user.role) {
      const permissions = getPermissionsForRole(user.role);
      this.currentPermissionsSubject.next(permissions);
    } else {
      // Clear permissions if no user
      this.currentPermissionsSubject.next({
        [Permission.VIEW_PROFILE]: false,
        [Permission.EDIT_PROFILE]: false,
        [Permission.EDIT_PERMISSION]: false
      });
    }
  }

  // Get current permissions
  getCurrentPermissions(): UserPermissions {
    return this.currentPermissionsSubject.value;
  }

  // Check specific permissions
  hasPermission(permission: Permission): boolean {
    const permissions = this.getCurrentPermissions();
    return permissions[permission] || false;
  }

  // Convenience methods for specific permissions
  canViewProfile(): boolean {
    return this.hasPermission(Permission.VIEW_PROFILE);
  }

  canEditProfile(): boolean {
    return this.hasPermission(Permission.EDIT_PROFILE);
  }

  canEditPermissions(): boolean {
    return this.hasPermission(Permission.EDIT_PERMISSION);
  }

  // Get list of granted permissions with display names
  getGrantedPermissions(): string[] {
    const permissions = this.getCurrentPermissions();
    const grantedPermissions: string[] = [];

    Object.entries(permissions).forEach(([key, value]) => {
      if (value) {
        const permission = key as Permission;
        grantedPermissions.push(getPermissionDisplayName(permission));
      }
    });

    return grantedPermissions;
  }

  // Get permission details for UI
  getPermissionDetails(): Array<{
    permission: Permission;
    displayName: string;
    granted: boolean;
    badgeColor: string;
  }> {
    const permissions = this.getCurrentPermissions();
    
    return Object.values(Permission).map(permission => ({
      permission,
      displayName: getPermissionDisplayName(permission),
      granted: permissions[permission] || false,
      badgeColor: getPermissionBadgeColor(permission)
    }));
  }

  // Get only granted permission details for UI
  getGrantedPermissionDetails(): Array<{
    permission: Permission;
    displayName: string;
    badgeColor: string;
  }> {
    return this.getPermissionDetails()
      .filter(detail => detail.granted)
      .map(detail => ({
        permission: detail.permission,
        displayName: detail.displayName,
        badgeColor: detail.badgeColor
      }));
  }

  // Get all permission details (for permission editor)
  getAllPermissionDetails(): PermissionDetail[] {
    return Object.values(Permission).map(permission => ({
      permission,
      displayName: getPermissionDisplayName(permission),
      badgeColor: getPermissionBadgeColor(permission)
    }));
  }

  // Get permission details by permission array
  getPermissionDetailsByPermissions(permissions: Permission[]): PermissionDetail[] {
    return permissions.map(permission => ({
      permission,
      displayName: getPermissionDisplayName(permission),
      badgeColor: getPermissionBadgeColor(permission)
    }));
  }

  // Check multiple permissions at once
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Get permission status for debugging
  getPermissionStatus(): {
    canView: boolean;
    canEdit: boolean;
    canEditPermissions: boolean;
    grantedPermissions: string[];
  } {
    return {
      canView: this.canViewProfile(),
      canEdit: this.canEditProfile(),
      canEditPermissions: this.canEditPermissions(),
      grantedPermissions: this.getGrantedPermissions()
    };
  }
}

