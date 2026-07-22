import { Suspense } from "react";
import { ResultView } from "@/components/medical/result-view";

export default function ResultPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Result</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">ผลการคัดกรองจาก AI</h1>
      </div>
      <Suspense fallback={<div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950"><p>กำลังโหลดผลการตรวจ...</p></div>}>
        <ResultView />
      </Suspense>
    </main>
  );
}
