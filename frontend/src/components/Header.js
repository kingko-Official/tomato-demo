import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import '../styles/Header.css';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Box display="flex" alignItems="center">
          <img 
            src="/favicon.ico" 
            alt="Logo" 
            className="logo" 
            style={{ width: '40px', height: '40px', marginRight: '15px' }}
          />
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            className="title"
          >
            番茄病害检测系统
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;