"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if already installed (running as PWA)
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsStandalone(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Don't render until we know standalone status
  if (isStandalone === null || isStandalone === true) return null;

  const handleClick = async () => {
    if (!installPrompt) return; // No prompt available, do nothing silently
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  return (
    <motion.button
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={handleClick}
      className="w-full sm:w-auto bg-[#0d1117] border-2 border-primary/50 rounded-2xl px-6 py-4 md:px-10 md:py-5 text-primary text-lg md:text-xl font-black shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:shadow-[0_0_50px_rgba(0,242,255,0.3)] hover:border-primary/80 transition-all active:scale-95 whitespace-nowrap"
    >
      ثبت التطبيق 📲
    </motion.button>
  );
}
