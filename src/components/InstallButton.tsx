"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsReady(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Fallback: If after 3 seconds no prompt, we still show the button as "Preparing"
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      // If user clicks while still preparing, we tell them to wait 1 second
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  if (isStandalone) return null;
  if (!isReady) return null; // Wait 2 seconds before showing anything

  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: installPrompt ? 1.05 : 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleInstallClick}
      className={`relative flex items-center gap-4 px-10 py-6 rounded-3xl transition-all duration-500 overflow-hidden group border-2 ${!installPrompt ? 'bg-white/5 border-white/10 opacity-50 cursor-wait' : 'bg-primary border-white/20 text-black shadow-[0_20px_60px_rgba(0,242,255,0.4)]'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />

      <div className="flex items-center gap-4 relative z-10 font-black">
        <div className={`p-2 rounded-xl ${installPrompt ? 'bg-black/10 animate-bounce' : 'bg-white/10'}`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div dir="rtl" className="text-right">
          <span className="block text-xl">
            {installPrompt ? "تثبيت الآن 📲" : "جاري التجهيز.."}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
