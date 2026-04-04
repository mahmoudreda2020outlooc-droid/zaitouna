"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Hide if already running as standalone PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // Capture the prompt when browser provides it
    const handlePrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const handleClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallPrompt(null);
        setIsInstalled(true);
      }
    } else {
      // Fallback: guide user manually
      alert("لتثبيت التطبيق: اضغط على القائمة (⋮) في المتصفح ثم اختر 'إضافة إلى الشاشة الرئيسية'");
    }
  };

  // Don't show if already installed as PWA
  if (isInstalled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full sm:w-auto"
      >
        <button
          onClick={handleClick}
          className="w-full sm:w-auto bg-[#0d1117] border-2 border-primary/50 rounded-2xl px-6 py-4 md:px-10 md:py-5 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.15)] hover:shadow-[0_0_50px_rgba(0,242,255,0.35)] hover:border-primary/80 transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="text-primary text-lg md:text-xl font-black tracking-wide whitespace-nowrap relative z-10" dir="rtl">
            ثبت التطبيق 📲
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
