import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types'; // Using central type definition

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Helper to load safe state from localStorage
const loadState = (): AuthState => {
  try {
    const serializedUser = localStorage.getItem('user');
    const serializedToken = localStorage.getItem('token');
    if (serializedUser === null || serializedToken === null) {
      return {
        user: null,
        isAuthenticated: false,
        token: null,
      };
    }
    return {
      user: JSON.parse(serializedUser),
      isAuthenticated: true,
      token: serializedToken,
    };
  } catch (err) {
    return {
      user: null,
      isAuthenticated: false,
      token: null,
    };
  }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setUser(state, action: PayloadAction<User>) {
        state.user = action.payload;
        // Also update localStorage if user details change while logged in
        localStorage.setItem('user', JSON.stringify(action.payload));
    }
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
