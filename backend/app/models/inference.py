import os
import json
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50
import torch.nn as nn
from flask import current_app

# 定义模型类
class TomatoDiseaseModel(nn.Module):
    def __init__(self, num_classes):
        """使用ResNet50作为基础模型"""
        super(TomatoDiseaseModel, self).__init__()
        # 加载ResNet50
        self.backbone = resnet50(pretrained=False)
        # 修改最终分类层
        num_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(num_features, num_classes)
        )
    
    def forward(self, x):
        return self.backbone(x)

class DiseasePredictor:
    def __init__(self):
        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.class_mapping = None
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # 初始化
        self._load_class_mapping()
        self._load_model()
        
    def _load_class_mapping(self):
        """加载类别映射"""
        try:
            with open(current_app.config['CLASS_MAPPING_PATH'], 'r') as f:
                self.class_mapping = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"加载类别映射失败: {str(e)}")
            # 创建一个默认映射，实际应用中应相应调整
            self.class_mapping = {
                "0": "Tomato_Bacterial_spot",
                "1": "Tomato_Early_blight",
                "2": "Tomato_Late_blight",
                "3": "Tomato_Leaf_Mold",
                "4": "Tomato_Septoria_leaf_spot",
                "5": "Tomato_Spider_mites_Two_spotted_spider_mite",
                "6": "Tomato_Target_Spot",
                "7": "Tomato_Tomato_Yellow_Leaf_Curl_Virus",
                "8": "Tomato_Tomato_mosaic_virus",
                "9": "Tomato_healthy"
            }
            # 保存默认映射
            os.makedirs(os.path.dirname(current_app.config['CLASS_MAPPING_PATH']), exist_ok=True)
            with open(current_app.config['CLASS_MAPPING_PATH'], 'w') as f:
                json.dump(self.class_mapping, f)
    
    def _load_model(self):
        """加载预训练模型"""
        try:
            # 确定类别数量
            num_classes = len(self.class_mapping)
            
            # 初始化模型
            self.model = TomatoDiseaseModel(num_classes)
            
            # 加载预训练权重
            if os.path.exists(current_app.config['MODEL_PATH']):
                self.model.load_state_dict(torch.load(
                    current_app.config['MODEL_PATH'], 
                    map_location=self.device
                ))
                print("成功加载模型权重")
            else:
                print(f"模型文件不存在: {current_app.config['MODEL_PATH']}")
            
            # 设置为评估模式
            self.model = self.model.to(self.device)
            self.model.eval()
            
        except Exception as e:
            print(f"加载模型失败: {str(e)}")
    
    def predict(self, image_tensor):
        """使用模型进行推理"""
        if self.model is None:
            raise ValueError("模型未正确加载")
        
        # 确保图像张量在正确的设备上
        image_tensor = image_tensor.to(self.device)
        
        with torch.no_grad():
            # 前向传播
            outputs = self.model(image_tensor)
            
            # 获取预测结果
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            top_probs, top_indices = torch.topk(probabilities, k=3, dim=1)
            
            # 获取前三个预测结果
            predictions = []
            for i in range(top_indices.shape[1]):
                idx = top_indices[0][i].item()
                prob = top_probs[0][i].item()
                class_name = self.class_mapping[str(idx)]
                predictions.append({
                    "class_name": class_name,
                    "probability": prob
                })
        
        return predictions