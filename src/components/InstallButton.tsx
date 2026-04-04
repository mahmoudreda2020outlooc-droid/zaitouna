"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if app is already installed/standalone
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Wait a bit before showing to feel "premium"
      setTimeout(() => setIsVisible(true), 2000);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // If it's already eligible (prompt won't fire again), but we want to know
    // Browsers don't always fire beforeinstallprompt if it already fired.
    // However, on refresh it should fire.

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
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

  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[340px] px-4"
        >
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#0d1117] border border-white/20 rounded-[2rem] p-4 flex items-center justify-between gap-4 shadow-[0_0_50px_rgba(0,242,255,0.15)] group transition-all active:scale-95"
          >
            <div className="flex flex-col text-right items-end flex-1" dir="rtl">
              <span className="text-white/80 text-sm font-bold">تطبيق الزتونة</span>
              <span className="text-primary text-lg font-black tracking-tight">
                {installPrompt ? "تثبيت الآن" : "جاري التفعيل.."}
              </span>
            </div>

            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>

            {/* Animated Glow Border */}
            <div className="absolute inset-0 rounded-[2rem] border border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity blur shadow-[0_0_15px_rgba(0,242,255,0.3)]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
