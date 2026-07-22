"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Stethoscope, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[2rem] border border-sky-100 bg-white/95 p-6 shadow-[0_20px_60px_rgba(37,99,235,0.16)] backdrop-blur sm:p-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
            <ShieldCheck size={16} />
            AI Screening Tool • Research Use Only
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              ระบบคัดกรองความเสี่ยงโรคอัลไซเมอร์เบื้องต้นด้วย AI จากภาพจอประสาทตา
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              เครื่องมือคัดกรองเบื้องต้นที่ช่วยให้ผู้ใช้และทีมแพทย์ได้รับสัญญาณเตือนจากภาพจอประสาทตาอย่างปลอดภัยและทันสมัย
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6 shadow-lg shadow-sky-200">
              <Link href="/upload">เริ่มตรวจ</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="rounded-full px-6">
              <Link href="/dashboard">ดูประวัติการตรวจ</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 rounded-full border border-sky-100 bg-gradient-to-r from-sky-600 to-blue-700 px-3 py-2 text-white shadow-sm">
              <Activity size={16} className="text-sky-100" />
              Fast Screening
            </div>
            <div className="flex items-center gap-2 rounded-full border border-sky-100 bg-gradient-to-r from-sky-600 to-blue-700 px-3 py-2 text-white shadow-sm">
              <Stethoscope size={16} className="text-sky-100" />
              Medical Review
            </div>
            <div className="flex items-center gap-2 rounded-full border border-sky-100 bg-gradient-to-r from-sky-600 to-blue-700 px-3 py-2 text-white shadow-sm">
              <Sparkles size={16} className="text-sky-100" />
              Explainable Insights
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-600 via-cyan-500 to-blue-700 p-4 text-white shadow-2xl shadow-sky-200/70">
        <div className="rounded-[1.5rem] bg-white/15 p-4 backdrop-blur md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-100">AI Screening Assistant</p>
              <p className="text-2xl font-semibold">MyEye</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3">
              <ShieldCheck size={24} />
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-white/20 bg-slate-950/20 p-2">
            <Image src="/retina-illustration.svg" alt="Retina illustration" width={720} height={560} className="floaty h-auto w-full rounded-[1rem]" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white/20 p-4">
              <p className="text-sm text-sky-100">ผลลัพธ์ที่ได้</p>
              <p className="mt-1 text-xl font-semibold">ปกติ / เสี่ยงต่ำ / เสี่ยงสูง</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-4">
              <p className="text-sm text-sky-100">คำเตือน</p>
              <p className="mt-1 text-sm leading-6 text-sky-50">
                ผลลัพธ์นี้ไม่ใช้แทนการวินิจฉัยของแพทย์และควรได้รับการตรวจยืนยันจากผู้เชี่ยวชาญ
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
