"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
            return;
        }

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // Guard for Android/Chrome prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
            // Show prompt after a short delay to be less intrusive
            setTimeout(() => setIsVisible(true), 3000);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // For iOS, we can't detect "installable" via event, so we show it if not standalone
        if (isIOSDevice && !isStandalone) {
            setTimeout(() => setIsVisible(true), 5000);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, [isStandalone]);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === "accepted") {
            setInstallPrompt(null);
            setIsVisible(false);
        }
    };

    if (isStandalone || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999]"
            >
                <div className="glass-card p-5 border border-primary/20 shadow-[0_20px_50px_rgba(0,242,255,0.2)] relative overflow-hidden">
                    {/* Progress background effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1px]">
                            <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center overflow-hidden">
                                <img src="/icons/icon-192x192.png" alt="Zaitouna Icon" className="w-10 h-10 object-contain" />
                            </div>
                        </div>
                        <div dir="rtl">
                            <h3 className="text-white font-black text-lg leading-tight">تحميل تطبيق الزتونة</h3>
                            <p className="text-white/50 text-xs font-medium">تجربة أسرع وأسهل على موبايلك</p>
                        </div>
                    </div>

                    {isIOS ? (
                        <div dir="rtl" className="bg-white/5 rounded-xl p-3 mb-4">
                            <p className="text-white/80 text-[10px] leading-relaxed">
                                للتثبيت على iPhone: اضغط على <span className="bg-white/20 px-1 rounded inline-block">شارك (Share)</span> ثم اختر <span className="text-primary font-bold">"إضافة إلى الشاشة الرئيسية"</span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 btn-premium py-3 text-xs font-black shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                            >
                                تثبيت الآن
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="px-4 py-3 rounded-xl bg-white/5 text-white/50 text-xs font-bold hover:bg-white/10 transition-colors"
                            >
                                بعدين
                            </button>
                        </div>
                    )}

                    {/* Close button for iOS or simple dismiss */}
                    {isIOS && (
                        <button
                            onClick={() => setIsVisible(false)}
                            className="w-full py-2 mt-2 text-white/30 text-[10px] uppercase tracking-widest font-black"
                        >
                            إغلاق
                        </button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
