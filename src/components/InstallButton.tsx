"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
            return;
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            // Logic for iOS or generic instructions
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            if (isIOS) {
                alert("لتثبيت التطبيق على iPhone:\n1. اضغط على زر 'Share' (المربع اللي طالع منه سهم).\n2. اختر 'Add to Home Screen' من القائمة.");
            } else {
                alert("لتحميل التطبيق:\nاضغط على علامة التثبيت في شريط العنوان فوق، أو تأكد إنك بتستخدم متصفح Chrome أو Edge.");
            }
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
        <div className="relative inline-block">
            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary/50 transition-all duration-500 overflow-hidden group"
            >
                {/* Premium Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Animated Slide Effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 rounded-xl bg-primary/20 text-primary">
                        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <div dir="rtl" className="text-right">
                        <span className="block text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">تطبيق الزتونة</span>
                        <span className="block text-sm font-bold text-white group-hover:text-primary transition-colors">تحميل الآن 📲</span>
                    </div>
                </div>

                {/* Glow behind icon */}
                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            </motion.button>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 p-4 rounded-2xl bg-[#0a0a0a]/90 border border-white/10 backdrop-blur-3xl shadow-2xl text-center z-[10000]"
                    >
                        <p className="text-white/80 text-[10px] font-bold leading-relaxed">
                            {installPrompt ? "ثبت التطبيق لتجربة أسرع وأسهل على موبايلك أو كمبيوترك" : "يدعم التثبيت على الهاتف والكمبيوتر (Chrome/Edge/Safari)"}
                        </p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-[#0a0a0a] border-r border-b border-white/10 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
