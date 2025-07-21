import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private users: User[] = [
    {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Admin Name',
      address: 'Admin Address',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE, Permission.EDIT_PERMISSION]
    },
    {
      username: 'user',
      password: 'user123',
      role: 'user',
      name: 'User Name',
      address: 'User Address',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user1',
      password: 'pass123',
      role: 'user',
      name: 'User One',
      address: '123 Street A',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user2',
      password: 'pass456',
      role: 'user',
      name: 'User Two',
      address: '456 Street B',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user3',
      password: 'pass789',
      role: 'user',
      name: 'User Three',
      address: '789 Street C',
      permissions: [Permission.VIEW_PROFILE]
    },
    {
      username: 'user4',
      password: 'pass101',
      role: 'user',
      name: 'User Four',
      address: '101 Street D',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user5',
      password: 'pass202',
      role: 'user',
      name: 'User Five',
      address: '202 Street E',
      permissions: [Permission.VIEW_PROFILE]
    },
    {
      username: 'user6',
      password: 'pass303',
      role: 'user',
      name: 'User Six',
      address: '303 Street F',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user7',
      password: 'pass404',
      role: 'user',
      name: 'User Seven',
      address: '404 Street G',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user8',
      password: 'pass505',
      role: 'user',
      name: 'User Eight',
      address: '505 Street H',
      permissions: [Permission.VIEW_PROFILE]
    },
    {
      username: 'user9',
      password: 'pass606',
      role: 'user',
      name: 'User Nine',
      address: '606 Street I',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user10',
      password: 'pass707',
      role: 'user',
      name: 'User Ten',
      address: '707 Street J',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user11',
      password: 'pass808',
      role: 'user',
      name: 'User Eleven',
      address: '808 Street K',
      permissions: [Permission.VIEW_PROFILE]
    },
    {
      username: 'user12',
      password: 'pass909',
      role: 'user',
      name: 'User Twelve',
      address: '909 Street L',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
    {
      username: 'user13',
      password: 'pass1010',
      role: 'user',
      name: 'User Thirteen',
      address: '1010 Street M',
      permissions: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE]
    },
  ];

  constructor() { }

  getUsers(): User[] {
    return this.users;
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  addUser(user: User): boolean {
    if (this.getUserByUsername(user.username)) {
      return false; // User already exists
    }
    this.users.push(user);
    return true;
  }

  updateUser(username: string, updatedUser: Partial<User>): boolean {
    const userIndex = this.users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
      return true;
    }
    return false;
  }

  updateUserPermissions(username: string, permissions: Permission[]): boolean {
    const userIndex = this.users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      this.users[userIndex].permissions = permissions;
      return true;
    }
    return false;
  }
}

