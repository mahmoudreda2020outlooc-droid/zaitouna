"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setDone(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") setDone(true);
    } else {
      alert("لتثبيت التطبيق: اضغط على (القائمة ⋮) في المتصفح واختر 'إضافة إلى الشاشة الرئيسية'");
    }
  };

  // Hide if user just installed
  if (done) return null;

  return (
    // Hide via CSS if running as installed PWA (standalone mode)
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full sm:w-auto install-btn-wrapper"
    >
      <button
        onClick={handleClick}
        className="w-full sm:w-auto bg-[#0d1117] border-2 border-primary/50 rounded-2xl px-6 py-4 md:px-10 md:py-5 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:shadow-[0_0_50px_rgba(0,242,255,0.35)] hover:border-primary/80 transition-all active:scale-95 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <span className="text-primary text-lg md:text-xl font-black whitespace-nowrap relative z-10" dir="rtl">
          ثبت التطبيق 📲
        </span>
      </button>
    </motion.div>
  );
}
