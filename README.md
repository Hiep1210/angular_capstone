# User Management Angular Application

A complete Angular application with authentication, user management, and role-based dashboards.

## Features

### 🔐 Authentication System
- **Login**: Secure user authentication with form validation
- **Signup**: User registration with comprehensive form validation
- **Logout**: Secure session termination
- **Route Guards**: Protected routes requiring authentication

### 👤 User Management
- **Profile Management**: View and edit user profile information
- **Role-based Access**: Different interfaces for admin and regular users
- **Persistent Sessions**: Login state maintained across browser sessions

### 📊 Dashboard Features
- **Admin Dashboard**: 
  - User statistics (total users, admin users, regular users)
  - Complete user list with role badges
  - User management overview
- **User Dashboard**: 
  - Personal information display
  - Profile management access
  - Clean, user-focused interface

### 🎨 Professional UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Styling**: Clean, professional appearance with CSS
- **Form Validation**: Real-time validation with error messages
- **Role Badges**: Visual distinction between admin and user roles
- **Loading States**: User feedback during operations

## Technology Stack

- **Frontend**: Angular 18+ with standalone components
- **Styling**: Pure CSS with responsive design
- **Forms**: Angular Reactive Forms with validation
- **Routing**: Angular Router with guards
- **State Management**: RxJS Observables
- **Authentication**: JWT-like token simulation with localStorage

## Mock Data

The application includes 15 pre-configured users:

### Admin User
- **Username**: admin
- **Password**: admin123
- **Role**: admin

### Regular Users
- **Username**: user, **Password**: user123
- **Username**: user1, **Password**: pass123
- **Username**: user2, **Password**: pass456
- ... (and 11 more users)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation
1. Navigate to the project directory:
   ```bash
   cd user-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Testing the Application

1. **Login as Admin**:
   - Username: `admin`
   - Password: `admin123`
   - Access admin dashboard with user statistics and management

2. **Login as Regular User**:
   - Username: `user`
   - Password: `user123`
   - Access user dashboard with profile management

3. **Create New User**:
   - Click "Sign up here" on login page
   - Fill out the registration form
   - Login with new credentials

## Application Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # Login component
│   │   ├── signup/         # User registration
│   │   ├── dashboard/      # Role-based dashboard
│   │   └── profile/        # Profile management
│   ├── services/
│   │   ├── auth.service.ts      # Authentication logic
│   │   └── mock-data.service.ts # User data management
│   ├── guards/
│   │   └── auth.guard.ts        # Route protection
│   ├── models/
│   │   └── user.model.ts        # User interfaces
│   ├── app.routes.ts            # Application routing
│   └── app.config.ts            # App configuration
```

## Key Features Implemented

### Authentication Flow
1. User enters credentials on login page
2. AuthService validates against mock data
3. Successful login stores user data in localStorage
4. User is redirected to dashboard
5. AuthGuard protects authenticated routes

### Role-Based Access
- **Admin users** see comprehensive dashboard with all user data
- **Regular users** see simplified dashboard focused on personal management
- Role badges provide visual distinction throughout the app

### Profile Management
- View current user information
- Edit name and address fields
- Real-time form validation
- Success/error feedback
- Persistent data updates

### Form Validation
- Required field validation
- Minimum length requirements
- Real-time error display
- Disabled submit buttons until valid
- Professional error styling

## Security Features

- Password fields are properly masked
- Authentication state management
- Route protection with guards
- Session persistence with localStorage
- Form validation prevents invalid submissions

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## Browser Compatibility

Tested and compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential improvements for production use:
- Backend API integration
- Real JWT authentication
- Password encryption
- Email verification
- Password reset functionality
- Advanced user roles and permissions
- User avatar uploads
- Activity logging
- Advanced search and filtering

## Support

For questions or issues, please refer to the Angular documentation or create an issue in the project repository.

---

**Built with Angular 18+ and modern web technologies**

