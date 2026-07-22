from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel

app = FastAPI(title="MyEye API", version="0.1.0")


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    description: str
    recommendation: str
    gradcam: str | None = None


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    # Placeholder inference logic for integration with a real model.
    return PredictionResponse(
        prediction="High Risk",
        confidence=94.62,
        description="AI ตรวจพบลักษณะที่สัมพันธ์กับความเสี่ยงของโรคอัลไซเมอร์",
        recommendation="ควรเข้าพบแพทย์เฉพาะทางเพื่อรับการตรวจเพิ่มเติม",
        gradcam="heatmap.png",
    )
