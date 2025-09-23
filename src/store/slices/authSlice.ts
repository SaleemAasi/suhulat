'use client';

import { AuthState } from '@/types/AuthState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Initial state
const initialState: AuthState & { loading: boolean; error: string | null } = {
  user: null,
  token: null,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
