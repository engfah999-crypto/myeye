# MyEye

MyEye คือโปรเจกต์เว็บแอปพลิเคชันสำหรับระบบคัดกรองความเสี่ยงโรคอัลไซเมอร์เบื้องต้นจากภาพจอประสาทตา (retinal fundus image) ด้วย AI โดยออกแบบให้มี UI ที่ดูเป็นระบบของโรงพยาบาล มีคำเตือนทางการแพทย์และความปลอดภัยในทุกขั้นตอน

## คุณสมบัติหลัก

- หน้าแรกที่มี Hero, workflow, highlights และ CTA
- หน้าอัปโหลดภาพพร้อมตรวจคุณภาพภาพเบื้องต้น
- หน้าแสดงผลลัพธ์จาก AI พร้อมคำอธิบายและคำแนะนำ
- Dashboard เก็บประวัติการตรวจใน Local Storage
- API route /api/predict สำหรับเชื่อมต่อ FastAPI
- Medical disclaimer ทุกหน้า

## โครงสร้างโปรเจกต์

- app/ - Next.js App Router
- components/medical/ - UI ที่เกี่ยวกับ medical flow
- components/ui/ - reusable UI primitives
- lib/ - utility และ mapping logic
- services/ - localStorage และ history service
- types/ - TypeScript types
- utils/ - file validation และ helper

## การติดตั้ง

```bash
npm install
cp .env.example .env.local
npm run dev
```

## ตัวแปรสิ่งแวดล้อม

- FASTAPI_URL: URL ของ FastAPI endpoint สำหรับการทำนาย

## FastAPI ตัวอย่าง

สร้างไฟล์ backend/app.py ด้วยโค้ดตัวอย่างดังนี้:

```python
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel

app = FastAPI()

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    description: str
    recommendation: str
    gradcam: str | None = None

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    return {
        "prediction": "High Risk",
        "confidence": 94.62,
        "description": "AI ตรวจพบลักษณะที่สัมพันธ์กับความเสี่ยงของโรคอัลไซเมอร์",
        "recommendation": "ควรเข้าพบแพทย์เฉพาะทางเพื่อรับการตรวจเพิ่มเติม",
        "gradcam": "heatmap.png",
    }
```

## วิธีเชื่อมต่อ AI Model

1. เตรียมโมเดล TensorFlow/PyTorch ที่รับ input RGB 512x512
2. แปลงภาพเป็น RGB และ resize ให้ได้ขนาด 512x512
3. ส่งภาพไปยัง endpoint /predict
4. รับผลลัพธ์และแสดงบนหน้า result

## แนวทางการฝึกโมเดลเบื้องต้น

- ใช้ dataset ของ retinal fundus image ที่มีป้ายกำกับ Normal / Low Risk / Medium Risk / High Risk
- เตรียมโครงสร้างโฟลเดอร์ train/valid/test
- ใช้ EfficientNet หรือ ResNet เป็น backbone
- ปรับแต่ง classification head สำหรับ 4 classes

## แนวทางทดสอบ

- ทดสอบการอัปโหลดไฟล์ถูกต้องและผิดประเภท
- ทดสอบกรณีภาพเบลอหรือความสว่างต่ำ
- ทดสอบกรณี API ล้มเหลว
- ทดสอบการบันทึกผลใน Local Storage

## Deploy

แนะนำให้ deploy บน Vercel สำหรับ frontend และ deploy FastAPI บน Render / Railway / Azure Container Apps

## Medical Disclaimer

ระบบนี้เป็นเพียงเครื่องมือคัดกรองเบื้องต้นเพื่อการศึกษาและงานวิจัยเท่านั้น ไม่สามารถใช้วินิจฉัยโรคได้ ผลลัพธ์จาก AI ควรได้รับการยืนยันโดยแพทย์ผู้เชี่ยวชาญก่อนนำไปใช้ในการตัดสินใจทางการแพทย์
