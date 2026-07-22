import type { Metadata } from "next";
import { Prompt, IBM_Plex_Sans_Thai } from "next/font/google";
import Link from "next/link";
import { Activity, Home, LayoutDashboard, ScanLine, ShieldCheck } from "lucide-react";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MyEye | Alzheimer Screening",
  description: "MyEye medical AI screening prototype for retinal fundus images with disclaimer and explainable results.",
};

const navItems = [
  { href: "/", label: "หน้าหลัก", icon: Home },
  { href: "/upload", label: "ตรวจภาพ", icon: ScanLine },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${prompt.variable} ${ibmPlexSansThai.variable} h-full antialiased`}>
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_42%)] bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-sky-200/80 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white shadow-lg shadow-sky-200/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-600 p-2 text-white">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">MyEye</p>
                  <p className="text-xs text-sky-100">Early Alzheimer Risk Screening</p>
                </div>
              </Link>
              <nav className="flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-2 text-sm text-white transition hover:bg-white/25 hover:text-sky-50">
                      <Icon size={16} /> {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>
          {children}
          <footer className="border-t border-sky-200/80 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 py-6 text-center text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-100" />
                <span>Research use only • Not for diagnosis • Consult a medical professional</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
