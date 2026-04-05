"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (standalone) return;

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log("Install prompt captured");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsStandalone(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone === null || isStandalone === true) return null;

  const handleAndroidClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  const handleIOSClick = () => {
    setShowIOSInstructions(!showIOSInstructions);
  };

  // Render logic
  return (
    <div className="relative flex flex-col items-center">
      {/* iOS Instructions Tooltip */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-6 w-80 p-5 bg-[#161b22] border-2 border-primary/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[9999] text-right backdrop-blur-xl"
          >
            <p className="text-white text-base mb-4 font-black flex items-center justify-end gap-2">عشان تنزل التطبيق على آيفون: 🍏</p>
            <ol className="text-white/80 text-xs space-y-2 pr-2 border-r-2 border-primary/20">
              <li>1. دوس على زرار المشاركة (Share) المربع اللي فيه سهم لفوق. 📤</li>
              <li>2. انزل تحت ودوس على "إضافة إلى الشاشة الرئيسية" (Add to Home Screen). ➕</li>
              <li>3. كدة التطبيق هينزل عندك وتقدر تفتحه في أي وقت! ✨</li>
            </ol>
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 w-4 h-4 bg-[#161b22] border-r border-b border-primary/30 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Button */}
      {isIOS ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={handleIOSClick}
          className="w-full sm:w-auto bg-[#0d1117]/80 backdrop-blur-md border-2 border-primary/50 rounded-2xl px-6 py-4 md:px-10 md:py-5 text-primary text-lg md:text-xl font-black shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:shadow-[0_0_50px_rgba(0,242,255,0.3)] hover:border-primary transition-all active:scale-95 whitespace-nowrap relative z-50"
        >
          {showIOSInstructions ? "قفل التعليمات ❌" : "تنزيل الأبلكيشن 🍏"}
        </motion.button>
      ) : (
        installPrompt && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleAndroidClick}
            className="w-full sm:w-auto bg-[#0d1117]/80 backdrop-blur-md border-2 border-primary/50 rounded-2xl px-6 py-4 md:px-10 md:py-5 text-primary text-lg md:text-xl font-black shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:shadow-[0_0_50px_rgba(0,242,255,0.3)] hover:border-primary transition-all active:scale-95 whitespace-nowrap relative z-50"
          >
            تنزيل الأبلكيشن 📲
          </motion.button>
        )
      )}
    </div>
  );
}
