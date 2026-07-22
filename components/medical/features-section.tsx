"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Eye, HeartPulse, ShieldAlert } from "lucide-react";

const features = [
  {
    title: "ตรวจวิเคราะห์ภาพด้วย AI",
    description: "ใช้โมเดลที่ออกแบบสำหรับภาพจอประสาทตาและสัญญาณทางการแพทย์เบื้องต้น",
    icon: BrainCircuit,
  },
  {
    title: "แบบ Explainable",
    description: "ให้คำอธิบายและคำแนะนำที่เข้าใจง่าย พร้อมกราฟ/Heatmap เพื่อสนับสนุนการพิจารณา",
    icon: Eye,
  },
  {
    title: "ปลอดภัยและโปร่งใส",
    description: "มีข้อความแจ้งเตือนว่าผลลัพธ์ไม่ใช่การวินิจฉัยและจำเป็นต้องรับการตรวจจากแพทย์",
    icon: ShieldAlert,
  },
  {
    title: "ติดตามผลย้อนหลัง",
    description: "บันทึกประวัติการตรวจไว้ในเครื่องเพื่อดูผลเดิมและวางแผนการรักษาต่อไป",
    icon: HeartPulse,
  },
];

export function FeaturesSection() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Highlights</p>
        <h2 className="text-3xl font-semibold text-blue-900">จุดเด่นของระบบที่ออกแบบมาเพื่อการศึกษาและงานวิจัย</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 p-6 text-black shadow-[0_8px_24px_rgba(59,130,246,0.12)] dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-black/80 dark:text-slate-300">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
