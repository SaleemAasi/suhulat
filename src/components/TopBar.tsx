"use client";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Breadcrumbs,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IUser } from "@/types/IUser";
import { pageTitles } from "@/utils/pageTitles"; // ✅ import mapping

interface TopBarProps {
  user: IUser;
}

export default function TopBar({ user }: TopBarProps) {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // ✅ Pick title based on current route
  const currentTitle = pageTitles[pathname] || "Dashboard";

  return (
    <AppBar position="sticky" elevation={1} color="inherit" sx={{ zIndex: 1101 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side: Page Title */}
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <Typography
            sx={{
              ml: { xs: 3, sm: 8, md: 2 },
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.4rem", lg: "1.6rem" },
              fontWeight: "bold",
              color: "black",
            }}
          >
            {currentTitle}
          </Typography>
        </Breadcrumbs>

        {/* Right side: User Menu */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleOpenMenu}>
            <Avatar src={user?.avatarUrl || ""} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
