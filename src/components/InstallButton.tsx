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
            console.log("Install prompt event captured!");
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // If it doesn't fire in 10 seconds, it might be throttled or not supported
        // but we'll just keep waiting.

        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            // If it's still preparing, give the user some help
            alert("الرسالة دي بتظهر لما المتصفح يكون لسه بيفحص ملفات التطبيق.\n\nاستنى ثواني وجرب تضغط تاني، أو اتأكد إنك فاتح من Chrome أو Edge.");
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden group ${!installPrompt ? 'opacity-60 cursor-pointer' : 'hover:border-primary/50 ring-2 ring-primary/20'}`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className={`p-2 rounded-xl transition-colors ${installPrompt ? 'bg-primary text-black animate-bounce' : 'bg-primary/20 text-primary'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <div dir="rtl" className="text-right">
                        <span className="block text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">تطبيق الزتونة</span>
                        <span className={`block text-sm font-bold transition-all ${installPrompt ? 'text-primary scale-110' : 'text-white'}`}>
                            {installPrompt ? "تحميل الآن 📲" : "جاري التحضير.."}
                        </span>
                    </div>
                </div>
            </motion.button>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 p-4 rounded-2xl bg-black border border-white/10 backdrop-blur-3xl shadow-2xl text-center z-[10000]"
                    >
                        <p className="text-white/80 text-[10px] font-bold leading-relaxed">
                            {installPrompt ? "اضغط فورا لتحميل التطبيق!" : "المتصفح بيجهز ملفات التحميل، ثواني وهيبقى جاهز."}
                        </p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-black border-r border-b border-white/10 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
