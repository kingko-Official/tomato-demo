import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import ImageUploader from '../components/ImageUploader';
import ResultDisplay from '../components/ResultDisplay';

function Home() {
  return (
    <Container maxWidth="lg" className="home-container">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          欢迎使用番茄病害检测系统
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          上传番茄植株图片，快速识别可能存在的疾病
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>系统特点</Typography>
            <ul>
              <li>基于深度学习模型，准确度高</li>
              <li>快速检测多种番茄常见病害</li>
              <li>提供详细的病害信息和处理建议</li>
              <li>简单易用的用户界面</li>
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>使用指南</Typography>
            <ol>
              <li>点击"选择图片"按钮上传番茄植株照片</li>
              <li>照片应清晰展示叶片、茎或果实的症状</li>
              <li>点击"开始检测"等待系统分析</li>
              <li>系统将显示检测结果和处理建议</li>
            </ol>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;