'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  Store as StoreIcon,
  AccountTree as BranchIcon,
  LocalMall as ProductIcon,
  Sell as SalesIcon,
  ShoppingBasket as PurchaseIcon,
  Receipt as InvoiceIcon,
  Person as RoleIcon,
  People as UsersIcon,
  Analytics as ReportsIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';

interface SidebarProps {
  role: string | null;
}

interface MenuItem {
  label: string;
  path?: string;
  icon?: JSX.Element;
  children?: MenuItem[];
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/' },
    {
      label: 'Store Management',
      children: [
        { label: 'Manage Store', icon: <StoreIcon fontSize="small" />, path: '/manage-store' },
        { label: 'Branches', icon: <BranchIcon fontSize="small" />, path: '/branches' },
      ],
    },
    {
      label: 'Inventory',
      children: [{ label: 'Product', icon: <ProductIcon fontSize="small" />, path: '/products' }],
    },
    {
      label: 'Sales / Purchases',
      children: [
        { label: 'Sales', icon: <SalesIcon fontSize="small" />, path: '/sales' },
        { label: 'Purchases', icon: <PurchaseIcon fontSize="small" />, path: '/purchases' },
      ],
    },
    {
      label: 'Invoice',
      children: [{ label: 'Generate Complaint Invoice', icon: <InvoiceIcon fontSize="small" />, path: '/generate-invoice' }],
    },
    {
      label: 'User',
      children: [
        { label: 'Owner', icon: <UsersIcon fontSize="small" />, path: '/owner' },
        { label: 'Manager', icon: <UsersIcon fontSize="small" />, path: '/manager' },
        { label: 'Cashier', icon: <UsersIcon fontSize="small" />, path: '/cashier' },
      ],
    },
    {
      label: 'Reports',
      children: [{ label: 'Reports', icon: <ReportsIcon fontSize="small" />, path: '/reports' }],
    },
    {
      label: 'AI Business',
      children: [{ label: 'Generate AI Business', icon: <AIIcon fontSize="small" />, path: '/generate-ai' }],
    },
  ];

const renderMenu = (items: MenuItem[]) =>
  items.map((item) => {
    const hasChildren = !!item.children?.length;
    const isActive = item.path && pathname === item.path;

    return (
      <Box key={item.label} sx={{ mb: 0.25 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => item.path && router.push(item.path)}
            sx={{
              justifyContent: 'flex-start',
              px: item.label === 'Dashboard' ? 3 : 2,
              py: 0.75,
              mx: item.label === 'Dashboard' ? 1 : 0,
              bgcolor: isActive ? '#0053FF' : 'transparent', // ✅ custom blue
              color: isActive ? '#fff' : 'text.primary',
              borderRadius: 1,
              minHeight: '34px',
              '&:hover': {
                bgcolor: isActive ? '#0053FF' : 'action.hover',
                color: isActive ? '#fff' : 'inherit',
              },
            }}
          >
            {item.icon && !hasChildren && (
              <ListItemIcon
                sx={{
                  minWidth: 28,
                  mr: 1,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: hasChildren ? 12.5 : 13.5,
                fontWeight: isActive ? 'bold' : 'medium',
                lineHeight: 1.3,
                textAlign: 'left',
              }}
            />
          </ListItemButton>
        </ListItem>

        {hasChildren &&
          item.children!.map((child) => {
            const isActiveChild = child.path && pathname === child.path;

            return (
              <ListItemButton
                key={child.label}
                onClick={() => child.path && router.push(child.path)}
                sx={{
                  px: 3,
                  py: 0.6,
                  justifyContent: 'flex-start',
                  minHeight: '28px',
                  backgroundColor: isActiveChild ? '#0053FF' : 'transparent', // ✅ custom blue
                  color: isActiveChild ? '#fff' : 'text.primary',
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': {
                    backgroundColor: isActiveChild ? '#0053FF' : 'action.hover',
                    color: isActiveChild ? '#fff' : 'inherit',
                  },
                }}
              >
                {child.icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 24,
                      mr: 1,
                      justifyContent: 'center',
                      color: isActiveChild ? '#fff' : 'text.secondary',
                    }}
                  >
                    {child.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={child.label}
                  primaryTypographyProps={{
                    fontSize: 12,
                    lineHeight: 1.2,
                    textAlign: 'left',
                    fontWeight: isActiveChild ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            );
          })}
      </Box>
    );
  });




  const drawerContent = (
    <>
      {/* Close button for mobile */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'flex-end',
          p: 1,
        }}
      >
        <IconButton onClick={handleDrawerToggle} color="primary">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Logo Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Image src="/logo.svg" alt="Logo" width={170} height={55} />
      </Box>

      <Box sx={{ px: 2.5, py: 1 }}>
        <Typography variant="subtitle1" color="text.secondary" fontSize={11}>
          Home
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ pt: 0.5 }}>{renderMenu(menuItems)}</List>
    </>
  );

  return (
    <>
      {/* Toggle button (hamburger) visible only when sidebar closed on mobile */}
      {!mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 260,
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="permanent"
          open
          sx={{
            '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
}
