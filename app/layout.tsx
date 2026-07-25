import type { Metadata } from "next";
import { Prompt, IBM_Plex_Sans_Thai } from "next/font/google";
import { ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/medical/site-header";
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
          <SiteHeader />
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
