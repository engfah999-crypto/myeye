"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteHistoryItem, loadHistory } from "@/services/history-service";
import type { HistoryRecord } from "@/types/medical";

export function DashboardPanel() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase();
    return records.filter((record) => {
      return [record.patientName, record.prediction, record.description, record.recommendation].some((value) => value?.toLowerCase().includes(query));
    });
  }, [records, search]);

  const refresh = () => setRecords(loadHistory());

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>ประวัติการตรวจ</CardTitle>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">บันทึกผลการตรวจทั้งหมดไว้ใน Local Storage ของเบราว์เซอร์</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาผลลัพธ์" className="pl-9" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            ไม่มีประวัติการตรวจในขณะนี้
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900/60">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{record.patientName || "ผู้ใช้"}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{record.prediction} • {record.confidence.toFixed(2)}%</p>
                <p className="mt-1 text-sm text-slate-500">{record.description}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/result?result=${encodeURIComponent(JSON.stringify(record))}`}>ดูผลลัพธ์</Link>
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => {
                  deleteHistoryItem(record.id);
                  refresh();
                }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
