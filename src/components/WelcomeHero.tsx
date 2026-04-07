"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function WelcomeHero() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState<boolean | null>(null);

    useEffect(() => {
        const standalone = window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true;
        setIsStandalone(standalone);

        const handler = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            await installPrompt.userChoice;
            setInstallPrompt(null);
        } else {
            alert("لتحميل التطبيق: استخدم خيار 'Add to Home Screen' من إعدادات المتصفح.");
        }
    };

    return (
        <section className="relative mb-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0a0f0f] to-[#0d1515] p-8 md:p-12 lg:p-16 border border-white/5 shadow-2xl animate-in fade-in zoom-in duration-1000">
            {/* Background Mesh Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(0,242,255,0.05),transparent_50%),radial-gradient(circle_at_90%_80%,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-right order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-right">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20">
                        نسخة الزتونة - تحت التجهيز 🫒
                    </span>

                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                        أنا الزتونة.. <br />
                        <span className="text-gradient">الدحيح</span> اللي هيجيبلك الناهية!
                    </h1>

                    <p className="text-foreground/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                        مساعدك الذكي (مش بس بوت) لطلبة تكنولوجيا المعلومات.. بنبسطلك الصعب عشان تذاكر بمزاج وتلم المنهج في شوال!
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <button
                            onClick={() => document.getElementById('subjects-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-black font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            زتونة المواد 📚
                        </button>

                        <Link href="/chat" className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold text-lg hover:bg-white/10 active:scale-95 transition-all">
                            اسأل الدحيح يابيه 🤖
                        </Link>

                        {!isStandalone && (
                            <button
                                onClick={handleInstall}
                                className="px-8 py-4 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary font-black text-lg hover:bg-secondary/20 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <span className="text-xl">📲</span> تنزيل الأبليكيشن
                            </button>
                        )}
                    </div>
                </div>

                {/* Illustration */}
                <div className="relative flex justify-center items-center h-[300px] order-1 lg:order-2">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-40 h-56 md:w-48 md:h-64 bg-gradient-to-b from-[#4ade80] to-[#16a34a] rounded-full shadow-[0_30px_60px_rgba(22,163,74,0.3)] flex items-center justify-center border-4 border-white/10"
                    >
                        {/* Highlights */}
                        <div className="absolute top-8 left-8 w-10 h-16 bg-white/20 rounded-full blur-xl rotate-12" />

                        {/* Eyes */}
                        <div className="absolute top-20 right-12 w-4 h-5 bg-[#0a2a1a] rounded-full flex items-start justify-center pt-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <div className="absolute top-20 left-12 w-4 h-5 bg-[#0a2a1a] rounded-full flex items-start justify-center pt-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>

                        {/* Mouth */}
                        <div className="absolute top-28 w-6 h-3 border-b-4 border-black/40 rounded-full" />

                        {/* Stem */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-8 bg-[#3f2b1d] rounded-full" />
                        <div className="absolute -top-4 left-1/2 w-8 h-4 bg-[#22c55e] rounded-full blur-[1px] rotate-[25deg]" />

                        {/* Floating Papers */}
                        <motion.div
                            animate={{ rotate: [-8, 8, -8], x: [-10, 10, -10], y: [-5, 5, -5] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute -top-16 -left-20 w-24 h-32 bg-white/95 rounded-2xl shadow-2xl border border-gray-200 flex flex-col p-5 gap-3"
                        >
                            <div className="w-full h-2 bg-primary/20 rounded" />
                            <div className="w-3/4 h-1.5 bg-gray-100 rounded" />
                            <div className="w-full h-1.5 bg-gray-100 rounded" />
                            <div className="w-full h-1.5 bg-gray-100 rounded" />
                        </motion.div>

                        <motion.div
                            animate={{ rotate: [8, -8, 8], x: [10, -10, 10], y: [5, -5, 5] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute bottom-4 -right-24 w-28 h-36 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 invisible md:flex flex-col"
                        >
                            <div className="w-full h-3 bg-secondary/20 rounded mb-4" />
                            <div className="space-y-2">
                                <div className="w-full h-2 bg-gray-50 rounded" />
                                <div className="w-full h-2 bg-gray-50 rounded" />
                                <div className="w-3/4 h-2 bg-gray-50 rounded" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                .text-gradient {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </section>
    );
}
