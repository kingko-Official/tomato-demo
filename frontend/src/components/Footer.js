import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import '../styles/Footer.css';

function Footer() {
  return (
    <Box component="footer" className="footer">
      <Typography variant="body2" color="textSecondary" align="center">
        © {new Date().getFullYear()} 番茄病害检测系统 | 基于深度学习技术
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
        <Link href="#" color="inherit" underline="hover">
          使用指南
        </Link>
        {' | '}
        <Link href="#" color="inherit" underline="hover">
          关于我们
        </Link>
        {' | '}
        <Link href="#" color="inherit" underline="hover">
          隐私政策
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;