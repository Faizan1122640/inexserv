import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('admin_token') || null;
const initialUserRaw = localStorage.getItem('admin_user');
let initialUser = null;
try {
  initialUser = initialUserRaw ? JSON.parse(initialUserRaw) : null;
} catch (e) {
  initialUser = null;
}

const initialState = {
  token: initialToken,
  user: initialUser,
  isAuthenticated: Boolean(initialToken || localStorage.getItem('ies_admin_auth')),
  role: initialUser?.role || (initialToken ? 'admin' : null),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.role = user?.role || 'admin';

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      localStorage.setItem('ies_admin_auth', 'true');
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;

      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('ies_admin_auth');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
