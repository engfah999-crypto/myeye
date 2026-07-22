"use client";

import { motion } from "framer-motion";
import { Camera, FileImage, ScanLine, Sparkles } from "lucide-react";

const steps = [
  {
    title: "อัปโหลดภาพ",
    description: "อัปโหลดภาพจอประสาทตาในรูปแบบ JPG หรือ PNG ที่มีความชัดเจน",
    icon: FileImage,
  },
  {
    title: "ตรวจคุณภาพภาพ",
    description: "ระบบตรวจความเบลอ ความสว่าง และความละเอียดก่อนส่งให้ AI",
    icon: ScanLine,
  },
  {
    title: "รับผลลัพธ์",
    description: "ดูระดับความเสี่ยง ค่าความมั่นใจ และคำแนะนำจากระบบ",
    icon: Camera,
  },
];

export function WorkflowSection() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Workflow</p>
        <h2 className="text-3xl font-semibold text-blue-900">ขั้นตอนใช้งานง่ายและปลอดภัย</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 p-6 text-slate-800 shadow-[0_8px_24px_rgba(59,130,246,0.12)] dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Icon size={22} />
              </div>
              <p className="text-sm font-semibold text-blue-700">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-black/80 dark:text-slate-300">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
