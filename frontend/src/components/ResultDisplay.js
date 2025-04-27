import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  Chip,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../styles/ResultDisplay.css';

// 颜色列表（用于饼图）
const COLORS = ['#4caf50', '#ff9800', '#f44336', '#9c27b0', '#3f51b5'];

function ResultDisplay({ result, error, isLoading, onClearResult }) {
  // 如果没有结果且没有错误，则不显示
  if (!result && !error && !isLoading) {
    return null;
  }
  
  // 如果正在加载，显示加载指示器
  if (isLoading) {
    return (
      <Paper elevation={3} className="result-container" sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          正在分析图片...
        </Typography>
      </Paper>
    );
  }
  
  // 如果有错误，显示错误信息
  if (error) {
    return (
      <Paper elevation={3} className="result-container">
        <Alert severity="error">
          <AlertTitle>检测失败</AlertTitle>
          {error}
        </Alert>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="outlined" onClick={onClearResult}>
            重新上传
          </Button>
        </Box>
      </Paper>
    );
  }
  
  // 格式化饼图数据
  const pieData = result.predictions.map(p => ({
    name: p.class_name.replace('Tomato_', ''),
    value: p.probability
  }));
  
  // 格式化置信度显示
  const formatProbability = (prob) => `${(prob * 100).toFixed(2)}%`;
  
  // 主要诊断结果
  const mainPrediction = result.predictions[0];
  const details = result.details;

  return (
    <Paper elevation={3} className="result-container">
      <Typography variant="h5" component="h2" gutterBottom>
        检测结果
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3, backgroundColor: '#f1f8e9' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            主要诊断: <strong>{details.name}</strong>
          </Typography>
          <Chip 
            label={`置信度: ${formatProbability(mainPrediction.probability)}`}
            color="primary"
            sx={{ mb: 2 }}
          />
          <Typography variant="body1" paragraph>
            {details.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            处理建议:
          </Typography>
          <Typography variant="body1">
            {details.treatment}
          </Typography>
        </CardContent>
      </Card>
      
      <Box className="result-details">
        <Box className="chart-container">
          <Typography variant="h6" gutterBottom>
            可能性分布
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${(value * 100).toFixed(1)}%)`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatProbability(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        
        <Box className="prediction-list">
          <Typography variant="h6" gutterBottom>
            所有检测结果
          </Typography>
          <List>
            {result.predictions.map((pred, index) => (
              <ListItem key={index} divider={index < result.predictions.length - 1}>
                <ListItemText 
                  primary={
                    <Typography variant="body1">
                      {index + 1}. {pred.class_name.replace('Tomato_', '').replace(/_/g, ' ')}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      置信度: {formatProbability(pred.probability)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      
      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="contained" onClick={onClearResult}>
          检测新图片
        </Button>
      </Box>
    </Paper>
  );
}

export default ResultDisplay;