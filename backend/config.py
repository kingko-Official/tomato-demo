import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Config:
    """应用配置类"""
    # Flask配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    
    # 上传文件配置
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 最大16MB
    
    # 模型配置
    MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'tomato_disease_model.pth')
    CLASS_MAPPING_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'class_mapping.json')
    
    # 确保必要的目录存在
    @staticmethod
    def init_app(app):
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)