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
      console.log("PWA Install Prompt Ready");
      e.preventDefault();
      setInstallPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Fallback detection if already installed but not standalone (e.g. mobile home screen)
    window.addEventListener("appinstalled", () => {
      setIsStandalone(true);
      setIsVisible(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      alert("المتصفح لسه بيجهز عملية التثبيت.. جرب تضغط تاني بعد ثانية");
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setIsVisible(false);
    }
  };

  // If already installed, definitely hide
  if (isStandalone) return null;

  // We show the button even if prompt isn't ready yet, but with a "loading" or "waiting" state if needed
  // OR just show it once ready. Let's try to show it as soon as we have the prompt.
  if (!installPrompt || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full md:w-auto"
      >
        <button
          onClick={handleInstallClick}
          className="w-full md:w-auto bg-black/40 backdrop-blur-md border-2 border-primary/50 shadow-[0_0_20px_rgba(0,242,255,0.2)] rounded-2xl px-10 py-5 flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="text-primary text-lg md:text-xl font-bold" dir="rtl">
            ثبت الآن 📲
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
