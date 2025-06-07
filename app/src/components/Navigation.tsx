'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Home as HomeIcon,
  List as ListIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

/**
 * アプリケーションナビゲーション
 */
const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigationItems = [
    { label: 'ホーム', path: '/', icon: <HomeIcon /> },
    { label: '一覧', path: '/items', icon: <ListIcon /> },
    { label: '追加', path: '/items/new', icon: <AddIcon /> },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('/')}
        >
          Hiwari
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={!isMobile ? item.icon : undefined}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minWidth: isMobile ? 'auto' : undefined,
                px: isMobile ? 1 : 2,
                backgroundColor: pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {isMobile ? item.icon : item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;