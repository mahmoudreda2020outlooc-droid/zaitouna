"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallButton() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
            return;
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === "accepted") {
            setInstallPrompt(null);
        }
    };

    // Only show if the prompt is ready and not already standalone
    if (isStandalone || !installPrompt) return null;

    return (
        <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all duration-300 group"
        >
            <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">تثبيت التطبيق</span>
        </motion.button>
    );
}
