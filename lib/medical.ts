import type { PredictionResponse, RiskLevel } from "@/types/medical";

export function getRiskLevel(confidence: number): RiskLevel {
  if (confidence >= 85) return "เสี่ยงสูง";
  if (confidence >= 65) return "เสี่ยงปานกลาง";
  if (confidence >= 45) return "เสี่ยงต่ำ";
  return "ปกติ";
}

export function normalizePrediction(result: PredictionResponse): PredictionResponse {
  const normalizedPrediction = result.prediction ?? "ปกติ";
  const confidence = Number(result.confidence ?? 0);
  const riskLevel = getRiskLevel(confidence);

  return {
    ...result,
    prediction: normalizedPrediction,
    confidence,
    description: result.description || "ระบบ AI ได้ตรวจเชิงสัญญาณเบื้องต้นจากภาพจอประสาทตา",
    recommendation:
      result.recommendation || "กรุณาเข้าพบแพทย์ผู้เชี่ยวชาญเพื่อยืนยันผลลัพธ์เพิ่มเติม",
    createdAt: result.createdAt || new Date().toISOString(),
    inputImage: result.inputImage || "",
    patientName: result.patientName || "ผู้ใช้",
    notes: result.notes || "",
  };
}

export function getSeverityTone(risk: RiskLevel) {
  switch (risk) {
    case "เสี่ยงสูง":
      return "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-950/40";
    case "เสี่ยงปานกลาง":
      return "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40";
    case "เสี่ยงต่ำ":
      return "text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/40";
    default:
      return "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40";
  }
}
