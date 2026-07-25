"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, LayoutDashboard, Menu, ScanLine, X } from "lucide-react";

const navItems = [
  { href: "/", label: "หน้าหลัก", icon: Home },
  { href: "/upload", label: "ตรวจภาพ", icon: ScanLine },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-sky-200/80 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white shadow-lg shadow-sky-200/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-600 p-2 text-white">
            <Home size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">MyEye</p>
            <p className="text-xs text-sky-100">Early Alzheimer Risk Screening</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-2 text-sm text-white transition hover:bg-white/25 hover:text-sky-50"
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} border-t border-white/10 bg-slate-950/95 md:hidden`}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
