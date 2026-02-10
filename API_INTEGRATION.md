# API Integration Documentation

## Authentication API Integration

This application is integrated with a backend API for user authentication. The integration uses **TanStack Query (React Query)** for efficient data fetching and state management.

### Base Configuration

- **Base URL**: `http://localhost:5000/api`
- **API Client**: Axios with interceptors for authentication
- **State Management**: Redux Toolkit for auth state + TanStack Query for API calls

### Endpoints Integrated

#### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Request Body**:
  ```json
  {
    "name": "Lakshmi",
    "email": "lakshmi@example.com",
    "password": "password123",
    "phone_number": "9012345678"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "userId": 2
  }
  ```
- **Hook**: `useRegister()`
- **Page**: `/signup`

#### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "lakshmi@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt-token-here",
    "user": {
      "id": 2,
      "name": "Lakshmi",
      "email": "lakshmi@example.com",
      "phone_number": "9012345678"
    }
  }
  ```
- **Hook**: `useLogin()`
- **Page**: `/signin`

### File Structure

```
src/
├── services/
│   ├── api.ts              # Axios instance with interceptors
│   ├── authService.ts      # Authentication API methods
│   └── index.ts            # Service exports
├── hooks/
│   ├── useAuth.ts          # TanStack Query hooks for auth
│   └── redux.ts            # Redux hooks
├── pages/
│   ├── SignUp.tsx          # Registration page
│   └── SignIn.tsx          # Login page
└── store/
    └── authSlice.ts        # Redux auth state
```

### How It Works

1. **User Registration Flow**:
   - User fills out the signup form (name, email, password, phone number)
   - Form validation using Zod schema
   - `useRegister()` hook calls the API
   - On success: Shows toast notification and redirects to `/signin`
   - On error: Shows error toast with message

2. **User Login Flow**:
   - User enters email and password
   - Form validation using Zod schema
   - `useLogin()` hook calls the API
   - On success:
     - Stores user data and token in Redux
     - Saves to localStorage for persistence
     - Shows welcome toast
     - Redirects to home page
   - On error: Shows error toast with message

3. **Authentication Persistence**:
   - Token stored in localStorage
   - Axios interceptor automatically adds token to requests
   - On 401 errors, user is logged out and redirected to signin

### Features

✅ Form validation with Zod
✅ Loading states during API calls
✅ Error handling with user-friendly messages
✅ Toast notifications for feedback
✅ Automatic token management
✅ Protected routes
✅ Persistent authentication

### Testing the Integration

1. Start the backend server on `http://localhost:5000`
2. Start the frontend: `npm run dev`
3. Navigate to `/signup` and create an account
4. Check the network tab to see the API call
5. After registration, sign in with your credentials
6. You should be redirected to the home page with authentication

### Environment Variables (Future Enhancement)

For production, consider moving the API base URL to environment variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then update `src/services/api.ts`:
```typescript
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
```
