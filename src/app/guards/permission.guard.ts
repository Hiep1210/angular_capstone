import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if user is logged in first
    if (!this.authService.isLoggedInValue) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get required permission from route data
    const requiredPermission = route.data['permission'] as Permission;
    
    if (!requiredPermission) {
      // No specific permission required, allow access
      return true;
    }

    // Check if user has the required permission
    return this.permissionService.currentPermissions$.pipe(
      take(1),
      map(permissions => {
        const hasPermission = this.permissionService.hasPermission(requiredPermission);
        
        if (!hasPermission) {
          // Redirect to dashboard if permission denied
          this.router.navigate(['/dashboard'], {
            queryParams: { 
              error: 'insufficient_permissions',
              required: requiredPermission 
            }
          });
          return false;
        }
        
        return true;
      })
    );
  }
}

// Alternative guard for checking multiple permissions
@Injectable({
  providedIn: 'root'
})
export class MultiplePermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (!this.authService.isLoggedInValue) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get required permissions from route data
    const requiredPermissions = route.data['permissions'] as Permission[];
    const requireAll = route.data['requireAll'] as boolean || false;
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    return this.permissionService.currentPermissions$.pipe(
      take(1),
      map(permissions => {
        let hasAccess = false;
        
        if (requireAll) {
          hasAccess = this.permissionService.hasAllPermissions(requiredPermissions);
        } else {
          hasAccess = this.permissionService.hasAnyPermission(requiredPermissions);
        }
        
        if (!hasAccess) {
          this.router.navigate(['/dashboard'], {
            queryParams: { 
              error: 'insufficient_permissions',
              required: requiredPermissions.join(','),
              requireAll: requireAll.toString()
            }
          });
          return false;
        }
        
        return true;
      })
    );
  }
}

// Role-based guard (simpler alternative)
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    if (!this.authService.isLoggedInValue) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    const currentUser = this.authService.currentUserValue;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!currentUser || !requiredRoles.includes(currentUser.role)) {
      this.router.navigate(['/dashboard'], {
        queryParams: { 
          error: 'insufficient_role',
          required: requiredRoles.join(','),
          current: currentUser?.role || 'none'
        }
      });
      return false;
    }
    
    return true;
  }
}

