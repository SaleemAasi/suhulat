"use client";

import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { RootState } from "@/store";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthGuard>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          overflowY: "auto",
        }}
      >
        {/* Sidebar */}
        <Sidebar role={user?.role} />

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TopBar user={user} />

          {/* Page-specific content */}
          <Box sx={{ p: 2, flexGrow: 1 }}>{children}</Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
