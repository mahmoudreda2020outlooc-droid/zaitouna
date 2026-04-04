"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        console.log("Zaitouna Install Button Mounted");

        const handleBeforeInstallPrompt = (e: any) => {
            console.log("beforeinstallprompt fired!");
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            alert("لتحميل التطبيق على موبايلك:\n1. افتح الموقع من Chrome.\n2. اضغط على الـ 3 نقط فوق واختار 'Install App' أو 'Add to Home Screen'.");
            return;
        }

        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === "accepted") setInstallPrompt(null);
    };

    return (
        <div className="relative inline-block">
            <motion.button
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleInstallClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative flex items-center justify-center px-8 py-5 rounded-2xl bg-gradient-to-r from-red-500 via-primary to-secondary text-white font-black text-lg shadow-[0_0_40px_rgba(255,0,0,0.5)] border-2 border-white/50 animate-pulse transition-all duration-300 z-[9999]"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="whitespace-nowrap">ثبت التطبيق الآن 📲</span>
                </div>

                {/* Extreme Glow Effect */}
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-2xl -z-10" />
            </motion.button>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl bg-black border-2 border-primary shadow-2xl text-center z-[10000]"
                    >
                        <p className="text-white text-sm font-bold">اضغط هنا لتحميل الزتونة على موبايلك فوراً!</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
