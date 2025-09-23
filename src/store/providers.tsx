// src/store/providers.tsx
"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { setCredentials, logout } from "@/store/slices/authSlice";
import {jwtDecode} from "jwt-decode";
import { error } from "console";

function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      
      try {
        const decoded: { exp: number; [key: string]: any } = jwtDecode(token);
        
        if (decoded.exp * 1000 > Date.now()) {
          dispatch(setCredentials({ user: decoded, token }));
        } else {
          localStorage.removeItem("token");
          dispatch(logout());
        }
      } catch (error) {
        console.log(error)
        localStorage.removeItem("token");
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitAuth />
      {children}
    </Provider>
  );
}
