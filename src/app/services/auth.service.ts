import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginRequest, SignupRequest } from '../models/user.model';
import { MockDataService } from './mock-data.service';
import { PermissionService } from './permission.service';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn: Observable<boolean>;

  constructor(
    private mockDataService: MockDataService,
    private permissionService: PermissionService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
    
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!user);
    this.isLoggedIn = this.isLoggedInSubject.asObservable();

    // Initialize permissions for stored user
    if (user) {
      this.permissionService.updatePermissions(user);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedInValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  login(loginRequest: LoginRequest): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      const user = this.mockDataService.getUserByUsername(loginRequest.username);
      
      if (user && user.password === loginRequest.password) {
        // Remove password from user object before storing
        const userWithoutPassword = { ...user };
        delete (userWithoutPassword as any).password;
        
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword);
        this.isLoggedInSubject.next(true);
        
        // Update permissions based on user role
        this.permissionService.updatePermissions(userWithoutPassword);
        
        observer.next({ success: true, message: 'Login successful', user: userWithoutPassword });
      } else {
        observer.next({ success: false, message: 'Invalid username or password' });
      }
      observer.complete();
    });
  }

  signup(signupRequest: SignupRequest): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      const newUser: User = {
        username: signupRequest.username,
        password: signupRequest.password,
        name: signupRequest.name,
        address: signupRequest.address,
        role: signupRequest.role || 'user'
      };

      const success = this.mockDataService.addUser(newUser);
      
      if (success) {
        observer.next({ success: true, message: 'User registered successfully' });
      } else {
        observer.next({ success: false, message: 'Username already exists' });
      }
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    
    // Clear permissions on logout
    this.permissionService.updatePermissions(null);
  }

  updateProfile(updatedUser: Partial<User>): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      const currentUser = this.currentUserValue;
      if (!currentUser) {
        observer.next({ success: false, message: 'No user logged in' });
        observer.complete();
        return;
      }

      const success = this.mockDataService.updateUser(currentUser.username, updatedUser);
      
      if (success) {
        const updatedCurrentUser = { ...currentUser, ...updatedUser };
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
        this.currentUserSubject.next(updatedCurrentUser);
        
        // Update permissions when user data changes (in case role changed)
        this.permissionService.updatePermissions(updatedCurrentUser);
        
        observer.next({ success: true, message: 'Profile updated successfully' });
      } else {
        observer.next({ success: false, message: 'Failed to update profile' });
      }
      observer.complete();
    });
  }

  // Permission-related helper methods
  hasPermission(permission: Permission): boolean {
    return this.permissionService.hasPermission(permission);
  }

  canViewProfile(): boolean {
    return this.permissionService.canViewProfile();
  }

  canEditProfile(): boolean {
    return this.permissionService.canEditProfile();
  }

  canEditPermissions(): boolean {
    return this.permissionService.canEditPermissions();
  }

  getUserPermissions(): string[] {
    return this.permissionService.getGrantedPermissions();
  }

  getPermissionStatus() {
    return this.permissionService.getPermissionStatus();
  }
}

