import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import '../styles/ImageUploader.css';

function ImageUploader({ onUploadStart, onPredictionResult, onError, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // 处理文件选择
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        onError('请上传JPG或PNG格式的图片');
        return;
      }
      
      // 验证文件大小（最大10MB）
      if (file.size > 10 * 1024 * 1024) {
        onError('图片大小不能超过10MB');
        return;
      }
      
      setSelectedFile(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (!selectedFile) {
      onError('请先选择图片');
      return;
    }
    
    // 通知开始上传
    onUploadStart();
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    try {
      // 发送请求
      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // 处理结果
      onPredictionResult(response.data);
    } catch (error) {
      let errorMessage = '上传失败，请稍后重试';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      onError(errorMessage);
    }
  };

  // 处理点击上传按钮
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <Paper elevation={3} className="uploader-container">
      <Typography variant="h5" component="h2" gutterBottom>
        上传番茄植株图片
      </Typography>
      <Typography variant="body1" gutterBottom>
        上传一张番茄植株的图片，系统将自动检测可能的病害类型
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Box className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        <Box 
          className="preview-area"
          onClick={handleClickUpload}
          sx={{
            cursor: 'pointer',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            backgroundColor: previewUrl ? 'transparent' : '#f8f9fa'
          }}
        >
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="预览" 
              style={{ maxWidth: '100%', maxHeight: '300px' }} 
            />
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
              <Typography variant="body1">
                点击或拖拽图片到此处上传
              </Typography>
              <Typography variant="caption" color="textSecondary">
                支持JPG、PNG格式，最大10MB
              </Typography>
            </>
          )}
        </Box>
        
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickUpload}
            disabled={isLoading}
            sx={{ mr: 2 }}
          >
            选择图片
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '开始检测'}
          </Button>
        </Box>
      </Box>
      
      {isLoading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          正在分析图片，请稍候...
        </Alert>
      )}
    </Paper>
  );
}

export default ImageUploader;