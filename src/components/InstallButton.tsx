"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  // If already installed (standalone) or if the browser hasn't fired the install prompt (likely already installed or not supported)
  // we hide it to keep the UI clean as requested.
  if (isStandalone || !installPrompt) return null;

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleInstallClick}
      className="relative flex items-center gap-3 px-8 py-5 rounded-3xl bg-white/5 border border-primary/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,242,255,0.15)] transition-all duration-500 overflow-hidden group hover:border-primary/60 ring-2 ring-primary/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="p-2.5 rounded-2xl bg-primary text-black scale-110 shadow-[0_0_25px_rgba(0,242,255,0.6)] animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div dir="rtl" className="text-right">
          <span className="block text-[10px] font-black text-primary/70 uppercase tracking-[0.3em] mb-0.5">تطبيق الزتونة</span>
          <span className="block text-lg font-black text-white drop-shadow-md">
            تثبيت الآن 📲
          </span>
        </div>
      </div>
    </motion.button>
  );
}
