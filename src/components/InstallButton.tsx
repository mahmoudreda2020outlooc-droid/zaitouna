"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already running as PWA? Don't show.
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstallPrompt(null);
      setInstalled(true);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Only show if browser supports native install prompt AND app not installed
  if (installed || !installPrompt) return null;

  return (
    <motion.button
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={async () => {
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === "accepted") setInstallPrompt(null);
      }}
      className="w-full sm:w-auto bg-[#0d1117] border-2 border-primary/50 rounded-2xl px-6 py-4 md:px-10 md:py-5 text-primary text-lg md:text-xl font-black shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:shadow-[0_0_50px_rgba(0,242,255,0.3)] hover:border-primary/80 transition-all active:scale-95 whitespace-nowrap"
    >
      ثبت التطبيق 📲
    </motion.button>
  );
}
