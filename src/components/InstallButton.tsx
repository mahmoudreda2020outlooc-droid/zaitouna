"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
    if (!installPrompt) {
      alert("المتصفح بيجهز ملفات التثبيت لمجرد ثواني.\n\nانزل واطلع في الصفحة (Scroll) وجرب تضغط تاني دلوقتى!");
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  if (isStandalone) return null;

  return (
    <div className="relative inline-block">
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInstallClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary/50 transition-all duration-500 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div dir="rtl" className="text-right">
            <span className="block text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">تطبيق الزتونة</span>
            <span className="block text-sm font-bold text-white group-hover:text-primary transition-colors">تثبيت الآن 📲</span>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
