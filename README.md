# 番茄病害检测系统

这是一个基于深度学习的番茄病害检测系统，可以通过上传番茄植株图像快速诊断可能的病害类型，并提供处理建议。

## 功能特点

- 检测多种常见番茄病害：细菌性斑点病、早疫病、晚疫病等
- 提供病害详细信息和处理建议
- 简洁直观的用户界面
- 可视化展示检测结果置信度
- 响应式设计，支持各种设备访问

## 技术架构

### 前端
- React.js
- Material-UI
- Recharts图表库
- Axios

### 后端
- Flask RESTful API
- PyTorch深度学习框架
- ResNet50预训练模型

## 快速开始

### 使用Docker Compose启动（推荐）

1. 确保安装了Docker和Docker Compose
2. 克隆仓库：`git clone https://github.com/yourusername/tomato-disease-detection.git`
3. 进入项目目录：`cd tomato-disease-detection`
4. 启动服务：`docker-compose up -d`
5. 访问 http://localhost 使用系统

### 手动启动

#### 后端

1. 进入后端目录：`cd backend`
2. 安装依赖：`pip install -r requirements.txt`
3. 启动服务：`python run.py`

#### 前端

1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm start`
4. 访问 http://localhost:3000 使用系统

## 模型训练

系统使用基于ResNet50的深度学习模型，在番茄病害数据集上训练得到。模型能够识别以下病害类型：

1. 细菌性斑点病 (Bacterial spot)
2. 早疫病 (Early blight)
3. 晚疫病 (Late blight)
4. 叶霉病 (Leaf mold)
5. 叶斑病 (Septoria leaf spot)
6. 二斑蜘蛛螨 (Spider mites)
7. 靶斑病 (Target spot)
8. 黄化曲叶病毒 (Yellow leaf curl virus)
9. 花叶病毒 (Mosaic virus)
10. 健康植株 (Healthy)

## 使用指南

1. 在主页面点击"选择图片"按钮选择待检测的番茄植株图片
2. 确保图片清晰展示植株症状（叶片、茎或果实）
3. 点击"开始检测"按钮
4. 系统将显示检测结果，包括最可能的病害类型、置信度、疾病描述和处理建议

## 许可证

本项目采用MIT许可证