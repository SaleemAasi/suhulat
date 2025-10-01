'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';  // 👈 import it
import branchReducer from './slices/branchSlice'; 
import productReducer from './slices/productSlice'; 
import storeReducer from './slices/storeSlice';
import salesReducer from './slices/salesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer, 
     branches: branchReducer, 
     products:productReducer,
      storeData: storeReducer,
     sales: salesReducer, 
  },
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
