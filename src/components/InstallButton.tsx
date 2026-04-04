"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Faster delay for inline appearance
      setTimeout(() => setIsVisible(true), 500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsStandalone(true);
      setIsVisible(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setIsVisible(false);
    }
  };

  if (isStandalone || !installPrompt || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full sm:w-auto"
      >
        <button
          onClick={handleInstallClick}
          className="w-full sm:w-auto bg-[#111] border-2 border-primary/40 rounded-2xl px-6 py-4 md:px-10 md:py-5 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.2)] hover:shadow-[0_0_50px_rgba(0,242,255,0.4)] transition-all active:scale-95 group relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <span className="text-primary text-lg md:text-xl font-black tracking-wide whitespace-nowrap" dir="rtl">
            ثبت الآن 📲
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
