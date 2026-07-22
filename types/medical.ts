export type RiskLevel = "ปกติ" | "เสี่ยงต่ำ" | "เสี่ยงปานกลาง" | "เสี่ยงสูง";

export interface PredictionResponse {
  prediction: RiskLevel | string;
  confidence: number;
  description: string;
  recommendation: string;
  gradcam?: string;
  inputImage?: string;
  patientName?: string;
  notes?: string;
  createdAt?: string;
}

export interface HistoryRecord extends PredictionResponse {
  id: string;
}

export interface UploadFormValues {
  patientName: string;
  age: string;
  notes: string;
  consent: boolean;
}
