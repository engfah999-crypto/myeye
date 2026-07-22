import { UploadPanel } from "@/components/medical/upload-panel";

export default function UploadPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Screening</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">อัปโหลดภาพและเริ่มการวิเคราะห์</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">ระบบจะตรวจคุณภาพภาพก่อนส่งไปยัง AI และแจ้งเตือนทันทีหากภาพไม่ผ่านเกณฑ์</p>
      </div>
      <UploadPanel />
    </main>
  );
}
