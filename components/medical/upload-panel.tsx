"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, FileImage, Loader2, RefreshCcw, ScanLine, Trash2, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { analyzeImageQuality, validateImageFile } from "@/utils/file-validation";
import { saveResult, setLatestResult } from "@/services/history-service";
import { normalizePrediction } from "@/lib/medical";
import type { PredictionResponse, UploadFormValues } from "@/types/medical";

export function UploadPanel() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [quality, setQuality] = useState<{ width: number; height: number; brightness: number; blur: number } | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormValues>({
    defaultValues: {
      patientName: "",
      age: "",
      notes: "",
      consent: true,
    },
  });

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }, []);

  const resetPreview = useCallback(() => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setQuality(null);
    setError(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("เบราว์เซอร์นี้ไม่รองรับการถ่ายภาพจากกล้อง กรุณาใช้การอัปโหลดไฟล์แทน");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setError("ไม่สามารถเปิดกล้องได้ กรุณาให้สิทธิ์การเข้าถึงกล้องหรือใช้การอัปโหลดไฟล์แทน");
    }
  }, []);

  const onFileSelect = useCallback(async (file?: File | null) => {
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.errors[0]);
      return;
    }

    try {
      const qualityResult = await analyzeImageQuality(file);
      setQuality(qualityResult);
      if (qualityResult.blur > 55) {
        setError("ภาพมีความเบลอมากเกินไป กรุณาอัปโหลดภาพที่ชัดเจนขึ้น");
        return;
      }
      if (qualityResult.brightness < 80) {
        setError("ภาพมีความสว่างไม่เพียงพอ กรุณาใช้ภาพที่สว่างขึ้น");
        return;
      }
      if (qualityResult.width < 256 || qualityResult.height < 256) {
        setError("ความละเอียดของภาพต่ำเกินไป กรุณาอัปโหลดภาพที่มีความละเอียดมากกว่า 256x256");
        return;
      }

      const nextPreview = URL.createObjectURL(file);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextPreview;
      });
      setSelectedFile(file);
      setError(null);
      setSuccessMessage("ภาพผ่านการตรวจคุณภาพแล้ว พร้อมสำหรับการวิเคราะห์");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถอ่านภาพได้");
    }
  }, []);

  const captureCameraImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `camera-capture-${Date.now()}.png`, { type: "image/png" });

    stopCamera();
    await onFileSelect(file);
  }, [onFileSelect, stopCamera]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      stopCamera();
    };
  }, [previewUrl, stopCamera]);

  const onSubmit = async (values: UploadFormValues) => {
    if (!selectedFile) {
      setError("กรุณาเลือกภาพก่อนกดวิเคราะห์");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("patientName", values.patientName || "ผู้ใช้");
      formData.append("age", values.age || "");
      formData.append("notes", values.notes || "");

      const response = await axios.post<PredictionResponse>("/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const normalized = normalizePrediction({
        ...response.data,
        patientName: values.patientName || "ผู้ใช้",
        notes: values.notes || "",
      });

      setLatestResult(normalized);
      saveResult(normalized);
      setSuccessMessage("AI ได้ประมวลผลภาพเรียบร้อยแล้วและบันทึกผลไว้ในระบบ");
      window.location.href = `/result?result=${encodeURIComponent(JSON.stringify(normalized))}`;
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error || "ไม่สามารถเชื่อมต่อกับ API ได้" : "เกิดข้อผิดพลาดจากระบบ";
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>อัปโหลดภาพจอประสาทตา</CardTitle>
          <p className="text-sm text-black dark:text-slate-300">รองรับไฟล์ JPG, PNG และภาพที่ถ่ายจากกล้องทุกชนิด</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-900/50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => onFileSelect(event.target.files?.[0])}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                <UploadCloud size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">ลากไฟล์มาวางหรือคลิกเพื่อเลือกภาพ</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">ไฟล์ต้องไม่เกิน 8 MB และมีความเห็นชัดเจน</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button type="button" onClick={() => fileInputRef.current?.click()}>
                  <FileImage size={16} /> เลือกรูปภาพ
                </Button>
                <Button type="button" variant="outline" onClick={() => void openCamera()}>
                  <Camera size={16} /> ใช้กล้องถ่ายภาพ
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-3">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                  <Image src={previewUrl} alt="Retinal preview" width={800} height={600} className="h-[320px] w-full object-contain" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={resetPreview}>
                    <RefreshCcw size={16} /> เลือกรูปใหม่
                  </Button>
                  <Button type="button" variant="secondary" onClick={resetPreview}>
                    <Trash2 size={16} /> ลบรูป
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                ยังไม่มีภาพที่เลือกไว้
              </motion.div>
            )}
          </AnimatePresence>

          {cameraOpen ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white dark:border-slate-700">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">กล้องถ่ายภาพ</p>
                <Button type="button" variant="secondary" size="sm" onClick={stopCamera}>
                  ปิด
                </Button>
              </div>
              <video ref={videoRef} className="h-[260px] w-full rounded-2xl object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />
              <div className="mt-3 flex gap-3">
                <Button type="button" className="w-full" onClick={() => void captureCameraImage()}>
                  ถ่ายภาพ
                </Button>
              </div>
            </div>
          ) : null}

          {quality ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              <p className="font-semibold text-slate-950 dark:text-white">ผลตรวจคุณภาพภาพ</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <div>ความกว้าง: {quality.width}px</div>
                <div>ความสูง: {quality.height}px</div>
                <div>ความสว่าง: {quality.brightness.toFixed(0)}</div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลผู้ใช้งาน</CardTitle>
          <p className="text-sm text-slate-700 dark:text-slate-300">กรอกข้อมูลเพื่อเชื่อมโยงกับผลตรวจและบันทึกประวัติ</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">ชื่อผู้ป่วย</label>
              <Input {...register("patientName", { required: "กรุณากรอกชื่อผู้ป่วย" })} placeholder="เช่น นางสาวสมใจ" />
              {errors.patientName ? <p className="mt-1 text-sm text-red-500">{errors.patientName.message}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">อายุ</label>
              <Input {...register("age")} placeholder="เช่น 68" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">บันทึกเพิ่มเติม</label>
              <Textarea {...register("notes")} placeholder="ระบุข้อมูลทางการแพทย์หรือข้อสังเกตเพิ่มเติม" />
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <p className="font-semibold">คำเตือนทางการแพทย์</p>
              <p className="mt-1">ระบบนี้เป็นเพียงเครื่องมือคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรค และผลลัพธ์ควรได้รับการยืนยันจากแพทย์ผู้เชี่ยวชาญ</p>
            </div>
            {error ? <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}
            {successMessage ? <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">{successMessage}</div> : null}
            <Button className="w-full" type="submit" disabled={isAnalyzing}>
              {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <ScanLine size={16} />} {isAnalyzing ? "กำลังวิเคราะห์..." : "วิเคราะห์ภาพ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
