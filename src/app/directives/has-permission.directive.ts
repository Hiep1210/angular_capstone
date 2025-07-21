import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../models/permission.model';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permission: Permission | null = null;
  private permissionSubscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  @Input() set appHasPermission(permission: Permission) {
    this.permission = permission;
    this.updateView();
  }

  ngOnInit(): void {
    // Subscribe to permission changes
    this.permissionSubscription = this.permissionService.currentPermissions$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    if (!this.permission) {
      return;
    }

    const hasPermission = this.permissionService.hasPermission(this.permission);

    if (hasPermission && !this.hasView) {
      // Show the element
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      // Hide the element
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

// Alternative directive for checking multiple permissions
@Directive({
  selector: '[appHasAnyPermission]',
  standalone: true
})
export class HasAnyPermissionDirective implements OnInit, OnDestroy {
  private permissions: Permission[] = [];
  private permissionSubscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  @Input() set appHasAnyPermission(permissions: Permission[]) {
    this.permissions = permissions;
    this.updateView();
  }

  ngOnInit(): void {
    this.permissionSubscription = this.permissionService.currentPermissions$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    if (!this.permissions || this.permissions.length === 0) {
      return;
    }

    const hasAnyPermission = this.permissionService.hasAnyPermission(this.permissions);

    if (hasAnyPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAnyPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

// Directive for checking all permissions
@Directive({
  selector: '[appHasAllPermissions]',
  standalone: true
})
export class HasAllPermissionsDirective implements OnInit, OnDestroy {
  private permissions: Permission[] = [];
  private permissionSubscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  @Input() set appHasAllPermissions(permissions: Permission[]) {
    this.permissions = permissions;
    this.updateView();
  }

  ngOnInit(): void {
    this.permissionSubscription = this.permissionService.currentPermissions$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    if (!this.permissions || this.permissions.length === 0) {
      return;
    }

    const hasAllPermissions = this.permissionService.hasAllPermissions(this.permissions);

    if (hasAllPermissions && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAllPermissions && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

