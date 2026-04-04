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
      setTimeout(() => setIsVisible(true), 1500);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

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

  // If already installed or prompt not ready yet, don't show anything at all
  if (isStandalone || !installPrompt || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 right-6 z-[9999] w-auto"
      >
        <button
          onClick={handleInstallClick}
          className="bg-[#111] border border-primary/30 rounded-2xl px-8 py-4 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all active:scale-95 group relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <span className="text-primary text-base font-black tracking-wide" dir="rtl">
            ثبت الآن 📲
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
