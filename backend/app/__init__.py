from flask import Flask
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    """创建和配置Flask应用"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # 初始化应用配置
    config_class.init_app(app)
    
    # 注册CORS，允许前端访问
    CORS(app)
    
    # 注册蓝图
    from app.routes import main_bp
    app.register_blueprint(main_bp)
    
    return app