import os
import cv2
import numpy as np
from PIL import Image
from werkzeug.utils import secure_filename
from flask import current_app

def allowed_file(filename):
    """检查文件扩展名是否允许上传"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_uploaded_file(file):
    """保存上传的文件"""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # 生成唯一文件名
        base, ext = os.path.splitext(filename)
        unique_filename = f"{base}_{np.random.randint(10000)}{ext}"
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        return file_path
    return None

def preprocess_image(image_path, transform):
    """预处理图像用于模型推理"""
    # 读取图像
    img = Image.open(image_path).convert('RGB')
    
    # 应用变换
    img_tensor = transform(img)
    
    return img_tensor.unsqueeze(0)  # 添加批次维度

def get_disease_info(disease_name):
    """返回疾病的详细信息和建议处理方法"""
    disease_info = {
        "Tomato_Bacterial_spot": {
            "name": "番茄细菌性斑点病",
            "description": "细菌性斑点病是由黄单胞菌属细菌引起的常见番茄疾病。感染初期在叶片、茎和果实上出现小而深褐色的病斑。",
            "treatment": "使用铜基杀菌剂防治；采用轮作；使用抗病品种；避免灌溉时弄湿叶片；清除病株和残留物。"
        },
        "Tomato_Early_blight": {
            "name": "番茄早疫病",
            "description": "早疫病由真菌引起，最初表现为叶片上的小黑褐色斑点，随后扩大形成同心环状病斑。严重时导致叶片枯萎。",
            "treatment": "定期喷洒杀菌剂；避免在植株潮湿时操作；移除并销毁受感染的植物部分；确保良好的空气流通。"
        },
        "Tomato_Late_blight": {
            "name": "番茄晚疫病",
            "description": "晚疫病在凉爽潮湿的条件下迅速蔓延。初期症状为叶片和茎上的不规则绿灰色水渍，随后变为棕色至黑色。",
            "treatment": "预防性使用杀菌剂；提高植株通风；避免灌溉时弄湿叶片；在干燥天气栽培；及时清除感染的植物部分。"
        },
        "Tomato_Leaf_Mold": {
            "name": "番茄叶霉病",
            "description": "叶霉病在高湿度条件下严重发生，叶片背面出现苍白至黄色斑块，随后形成橄榄绿色至灰褐色的霉层。",
            "treatment": "降低温室湿度；增加植株间距；避免叶面浇水；使用抗性品种；适当使用杀菌剂。"
        },
        "Tomato_Septoria_leaf_spot": {
            "name": "番茄叶斑病",
            "description": "叶斑病表现为叶片上出现小而圆的斑点，斑点中心灰白色，边缘深褐色，严重时导致叶片枯黄脱落。",
            "treatment": "定期使用杀菌剂；清除受感染的叶片；避免高湿环境；实行轮作；增加植株间距改善通风。"
        },
        "Tomato_Spider_mites_Two_spotted_spider_mite": {
            "name": "番茄二斑蜘蛛螨",
            "description": "蜘蛛螨是微小的害虫，在叶片背面吸食植物汁液，造成叶片正面出现黄色或白色斑点，严重时会产生网状物并导致叶片枯萎。",
            "treatment": "使用杀螨剂；喷水冲洗叶片；引入天敌如捕食螨；保持植株健康以增强抵抗力；隔离受感染植株。"
        },
        "Tomato_Target_Spot": {
            "name": "番茄靶斑病",
            "description": "靶斑病在叶片、茎和果实上形成类似靶心的同心环状褐色病斑，严重影响植株生长和产量。",
            "treatment": "定期使用杀菌剂；保持良好通风；避免叶面浇水；去除并销毁感染的植物部分；选择抗病品种。"
        },
        "Tomato_Tomato_Yellow_Leaf_Curl_Virus": {
            "name": "番茄黄化曲叶病毒病",
            "description": "黄化曲叶病毒由烟粉虱传播，感染植株表现叶片黄化、卷曲，植株矮化，花朵脱落，严重影响产量。",
            "treatment": "控制烟粉虱传播；使用防虫网；定期喷洒杀虫剂；清除田间杂草；种植抗病品种；及早移除病株。"
        },
        "Tomato_Tomato_mosaic_virus": {
            "name": "番茄花叶病毒病",
            "description": "花叶病毒导致叶片出现黄绿相间的花叶状、皱缩或变形，果实可能出现黄色斑纹或畸形。",
            "treatment": "没有直接的化学防治方法；清除并焚烧受感染植株；严格控制农具消毒；轮作；选用抗病品种；避免在潮湿条件下操作植株。"
        },
        "Tomato_healthy": {
            "name": "健康番茄",
            "description": "这是一株健康的番茄植株，叶片呈现正常的绿色，没有明显的病害或虫害迹象。",
            "treatment": "继续保持良好的栽培管理：适时灌溉、施肥、支架和整枝；定期检查植株健康状况；实施预防性病虫害管理。"
        }
    }
    
    return disease_info.get(disease_name, {
        "name": disease_name,
        "description": "未知病害类型。",
        "treatment": "请咨询专业植物病理学家以获取详细诊断和处理建议。"
    })