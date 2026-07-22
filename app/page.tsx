import { HeroSection } from "@/components/medical/hero-section";
import { WorkflowSection } from "@/components/medical/workflow-section";
import { FeaturesSection } from "@/components/medical/features-section";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <section className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 p-6 shadow-[0_8px_24px_rgba(59,130,246,0.12)] dark:border-slate-800 dark:bg-slate-950/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-white">พร้อมสำหรับการใช้งานและต่อยอด</h2>
            <p className="mt-2 text-sm leading-6 text-black/80 dark:text-slate-300">
              โปรเจกต์นี้ถูกออกแบบให้เป็น foundation สำหรับระบบ AI screening ที่มีความปลอดภัยและสามารถต่อยอดไปยังโมเดลจริงในอนาคตได้
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
            Medical disclaimer: ไม่ใช้แทนแพทย์และต้องรับการยืนยันจากผู้เชี่ยวชาญ
          </div>
        </div>
      </section>
    </main>
  );
}
