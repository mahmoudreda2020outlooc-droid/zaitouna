"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
            return;
        }

        const handleBeforeInstallPrompt = (e: any) => {
            console.log("Install prompt ready");
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            // If prompt not available, maybe remind user to use a compatible browser
            alert("الخاصية متاحة على متصفح Chrome أو Edge حالياً.");
            return;
        }

        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === "accepted") {
            setInstallPrompt(null);
        }
    };

    if (isStandalone) return null;

    return (
        <div className="relative">
            <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, shadow: "0 0 20px rgba(0,242,255,0.4)" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleInstallClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`relative flex items-center justify-center w-12 h-12 md:w-auto md:px-6 md:h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 overflow-hidden group ${!installPrompt ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
            >
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="relative">
                        <svg className="w-6 h-6 text-primary group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-ping" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest hidden md:block text-white group-hover:text-primary transition-colors">
                        تحميل التطبيق
                    </span>
                </div>
            </motion.button>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-4 right-0 w-48 p-3 rounded-xl bg-card/90 border border-white/10 backdrop-blur-2xl shadow-2xl text-[10px] text-white/70 text-right z-[100] pointer-events-none"
                    >
                        {installPrompt ? "ثبت الزتونة على موبايلك دلوقتي!" : "استخدم متصفح Chrome أو Edge لتحميل التطبيق"}
                        <div className="absolute top-0 right-5 -mt-1 w-2 h-2 bg-card/90 border-t border-l border-white/10 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
