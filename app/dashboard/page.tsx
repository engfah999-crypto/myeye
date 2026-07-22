import { DashboardPanel } from "@/components/medical/dashboard-panel";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Dashboard</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">ประวัติการตรวจและผลย้อนหลัง</h1>
      </div>
      <DashboardPanel />
    </main>
  );
}
