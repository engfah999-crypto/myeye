"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Download, Home, RefreshCw, ShieldAlert } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRiskLevel, getSeverityTone, normalizePrediction } from "@/lib/medical";
import { loadLatestResult, saveResult, setLatestResult } from "@/services/history-service";
import type { PredictionResponse, RiskLevel } from "@/types/medical";

export function ResultView() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    const raw = searchParams.get("result");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PredictionResponse;
        const normalized = normalizePrediction(parsed);
        setResult(normalized);
        setLatestResult(normalized);
        saveResult(normalized);
        return;
      } catch {
        // continue to fallback below
      }
    }

    const latest = loadLatestResult();
    if (latest) {
      setResult(normalizePrediction(latest));
    }
  }, [searchParams]);

  const riskLevel = useMemo(() => {
    if (!result?.confidence) return "ปกติ" as RiskLevel;
    return getRiskLevel(result.confidence);
  }, [result]);

  const handleDownload = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("MyEye - Medical Screening Report", 16, 20);
    doc.setFontSize(11);
    doc.text("Disclaimer: This is a screening aid and not a medical diagnosis.", 16, 32);
    doc.text(`Prediction: ${result.prediction}`, 16, 44);
    doc.text(`Confidence: ${result.confidence.toFixed(2)}%`, 16, 54);
    doc.text(`Recommendation: ${result.recommendation}`, 16, 66);
    doc.text(`Description: ${result.description}`, 16, 80);
    doc.text("Please consult a specialist for confirmation.", 16, 100);
    doc.save(`myeye-report-${Date.now()}.pdf`);
  };

  if (!result) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">ยังไม่มีผลการตรวจในตอนนี้</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">กรุณากลับไปที่หน้าส่งภาพเพื่อเริ่มการวิเคราะห์</p>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/upload">เริ่มคัดกรอง</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-600 to-cyan-700 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-sky-100">ผลการคัดกรองเบื้องต้น</p>
            <h1 className="text-3xl font-semibold">{result.prediction}</h1>
          </div>
          <Badge className={`${getSeverityTone(riskLevel)} border-0`}>{riskLevel}</Badge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">ค่าความมั่นใจ</p>
            <p className="mt-2 text-4xl font-semibold">{result.confidence.toFixed(2)}%</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">คำแนะนำ</p>
            <p className="mt-2 text-sm leading-6 text-sky-50">{result.recommendation}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>คำอธิบายจาก AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              {result.description}
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <div className="flex items-start gap-2">
                <ShieldAlert size={18} className="mt-0.5" />
                <p>ผลลัพธ์นี้เป็นเพียงเครื่องมือคัดกรองเบื้องต้นเพื่อการศึกษาและงานวิจัย ไม่ใช้แทนการวินิจฉัยโรค อย่างน้อยควรพิจารณาเข้าพบแพทย์ผู้เชี่ยวชาญ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heatmap / Grad-CAM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-sky-100 via-white to-slate-100 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              <div className="relative h-[280px] overflow-hidden rounded-[1.25rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.35),_rgba(255,255,255,0.1)_60%)]">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.4),transparent)]" />
                <div className="absolute left-[15%] top-[20%] h-24 w-24 rounded-full bg-sky-500/30 blur-3xl" />
                <div className="absolute bottom-[24%] right-[18%] h-32 w-32 rounded-full bg-amber-400/30 blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-sm font-medium text-slate-700 dark:text-slate-200">
                  Heatmap แสดงบริเวณที่ระบบ AI ให้ความสนใจในภาพ<br />ภาพตัวอย่างสำหรับการทดสอบและการพัฒนา
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={handleDownload}>
            <Download size={16} /> ดาวน์โหลดรายงาน PDF
          </Button>
          <Button asChild variant="outline">
            <Link href="/upload">
              <RefreshCw size={16} /> ตรวจใหม่
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">
              <Home size={16} /> กลับหน้าหลัก
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
