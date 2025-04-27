import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Footer from './components/Footer';
import './styles/App.css';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#388e3c', // 绿色，与番茄植物相关
    },
    secondary: {
      main: '#d32f2f', // 红色，与番茄果实相关
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

function App() {
  // 状态管理
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 处理预测结果
  const handlePredictionResult = (result) => {
    setPredictionResult(result);
    setIsLoading(false);
    setError(null);
  };
  
  // 处理错误
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
    setPredictionResult(null);
  };
  
  // 清除结果
  const handleClearResult = () => {
    setPredictionResult(null);
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Header />
        <Container maxWidth="lg" className="main-container">
          <ImageUploader 
            onUploadStart={() => {
              setIsLoading(true);
              setError(null);
            }}
            onPredictionResult={handlePredictionResult}
            onError={handleError}
            isLoading={isLoading}
          />
          <ResultDisplay 
            result={predictionResult}
            error={error}
            isLoading={isLoading}
            onClearResult={handleClearResult}
          />
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;