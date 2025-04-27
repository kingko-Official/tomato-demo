import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.utils.image_processing import save_uploaded_file, preprocess_image, get_disease_info
from app.models.inference import DiseasePredictor

# 创建蓝图
main_bp = Blueprint('main', __name__)

# 全局变量存储预测器实例
predictor = None

@main_bp.before_app_first_request
def initialize_predictor():
    """在应用第一次收到请求时初始化预测器"""
    global predictor
    predictor = DiseasePredictor()

@main_bp.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({"status": "ok"})

@main_bp.route('/api/predict', methods=['POST'])
def predict_disease():
    """接收上传的图片，预测疾病类型"""
    global predictor
    
    # 检查是否有文件
    if 'image' not in request.files:
        return jsonify({"error": "没有上传图片"}), 400
    
    file = request.files['image']
    
    # 检查文件名
    if file.filename == '':
        return jsonify({"error": "未选择图片"}), 400
    
    try:
        # 保存上传的文件
        file_path = save_uploaded_file(file)
        if not file_path:
            return jsonify({"error": "不支持的文件类型"}), 400
        
        # 预处理图像
        image_tensor = preprocess_image(file_path, predictor.transform)
        
        # 预测
        predictions = predictor.predict(image_tensor)
        
        # 获取主要预测结果的详细信息
        main_prediction = predictions[0]["class_name"]
        disease_details = get_disease_info(main_prediction)
        
        # 返回结果
        result = {
            "predictions": predictions,
            "details": disease_details,
            "image_path": os.path.basename(file_path)
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main_bp.route('/api/diseases', methods=['GET'])
def get_diseases():
    """返回所有可能的疾病类型及其信息"""
    diseases = [
        "Tomato_Bacterial_spot",
        "Tomato_Early_blight",
        "Tomato_Late_blight",
        "Tomato_Leaf_Mold",
        "Tomato_Septoria_leaf_spot",
        "Tomato_Spider_mites_Two_spotted_spider_mite",
        "Tomato_Target_Spot",
        "Tomato_Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato_Tomato_mosaic_virus",
        "Tomato_healthy"
    ]
    
    diseases_info = {disease: get_disease_info(disease) for disease in diseases}
    return jsonify(diseases_info)