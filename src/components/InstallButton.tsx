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
      // User requested NO MESSAGES, so we stay silent
      // or briefly flash the button to indicate we're waiting
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
        whileHover={{ scale: installPrompt ? 1.05 : 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInstallClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden group ${!installPrompt ? 'opacity-40 cursor-wait' : 'hover:border-primary/50 ring-2 ring-primary/20'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center gap-3 relative z-10">
          <div className={`p-2 rounded-xl transition-all duration-500 ${installPrompt ? 'bg-primary text-black scale-110 shadow-[0_0_20px_rgba(0,242,255,0.5)]' : 'bg-primary/10 text-primary/50'}`}>
            <svg className={`w-6 h-6 ${installPrompt ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div dir="rtl" className="text-right">
            <span className="block text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">تطبيق الزتونة</span>
            <span className={`block text-sm font-bold transition-all duration-500 ${installPrompt ? 'text-primary' : 'text-white/40'}`}>
              {installPrompt ? "تثبيت الآن 📲" : "جاري التفعيل.."}
            </span>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 p-4 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-3xl shadow-2xl text-center z-[10000]"
          >
            <p className="text-white/80 text-[10px] font-bold leading-relaxed">
              {installPrompt ? "اضغط فورا لتحميل التطبيق!" : "بنخلص إجراءات الأمان.. ثواني وهيبقى جاهز للتحميل."}
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-black/90 border-r border-b border-white/10 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
