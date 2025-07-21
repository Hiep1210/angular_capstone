// Custom permission system for Angular 20
export enum Permission {
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
  EDIT_PERMISSION = 'edit_permission'
}

export interface PermissionDetail {
  permission: Permission;
  displayName: string;
  badgeColor: string;
}

export interface UserPermissions {
  [Permission.VIEW_PROFILE]: boolean;
  [Permission.EDIT_PROFILE]: boolean;
  [Permission.EDIT_PERMISSION]: boolean;
}

export interface RolePermissionConfig {
  role: string;
  permissions: UserPermissions;
}

// Global permission configuration
export const ROLE_PERMISSIONS: RolePermissionConfig[] = [
  {
    role: 'admin',
    permissions: {
      [Permission.VIEW_PROFILE]: true,
      [Permission.EDIT_PROFILE]: true,
      [Permission.EDIT_PERMISSION]: true
    }
  },
  {
    role: 'user',
    permissions: {
      [Permission.VIEW_PROFILE]: true,
      [Permission.EDIT_PROFILE]: true,
      [Permission.EDIT_PERMISSION]: false
    }
  }
];

// Helper function to get permissions for a role
export function getPermissionsForRole(role: string): UserPermissions {
  const roleConfig = ROLE_PERMISSIONS.find(config => config.role === role);
  return roleConfig ? roleConfig.permissions : {
    [Permission.VIEW_PROFILE]: false,
    [Permission.EDIT_PROFILE]: false,
    [Permission.EDIT_PERMISSION]: false
  };
}

// Helper function to get permission display names
export function getPermissionDisplayName(permission: Permission): string {
  switch (permission) {
    case Permission.VIEW_PROFILE:
      return 'View Profile';
    case Permission.EDIT_PROFILE:
      return 'Edit Profile';
    case Permission.EDIT_PERMISSION:
      return 'Edit Permissions';
    default:
      return '';
  }
}

// Helper function to get permission badge color
export function getPermissionBadgeColor(permission: Permission): string {
  switch (permission) {
    case Permission.VIEW_PROFILE:
      return 'badge-blue';
    case Permission.EDIT_PROFILE:
      return 'badge-green';
    case Permission.EDIT_PERMISSION:
      return 'badge-red';
    default:
      return 'badge-gray';
  }
}

