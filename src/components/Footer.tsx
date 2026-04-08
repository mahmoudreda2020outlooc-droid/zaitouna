"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TECH_STACK = [
    { name: "React.js", color: "bg-cyan-500/10" },
    { name: "Next.js 16", color: "bg-white/10" },
    { name: "Appwrite Cloud", color: "bg-primary/20" },
    { name: "HTML5 & CSS3", color: "bg-orange-500/10" },
    { name: "JavaScript & TS", color: "bg-yellow-500/10" },
    { name: "Tailwind CSS", color: "bg-blue-500/10" },
    { name: "Framer Motion", color: "bg-pink-500/10" },
    { name: "PWA Support", color: "bg-green-500/10" }
];

export default function Footer() {
    const [rating, setRating] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        academicId: "",
        suggestions: "",
        complaints: ""
    });

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `*تقييم جديد لمنصّة الزتونة* 🫒\n\n` +
            `*الاسم:* ${formData.name || "غير محدد"}\n` +
            `*التليفون:* ${formData.phone || "غير محدد"}\n` +
            `*الرقم الأكاديمي:* ${formData.academicId || "غير محدد"}\n` +
            `*التقييم:* ${"⭐".repeat(rating) || "بدون تقييم"}\n\n` +
            `*الاقتراحات:* ${formData.suggestions || "لا يوجد"}\n` +
            `*الشكاوى:* ${formData.complaints || "لا يوجد"}\n\n` +
            `_شكراً لاهتمامك بتطوير الزتونة!_`;

        const waUrl = `https://wa.me/201004897420?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
    };

    return (
        <footer className="relative mt-24 pb-12 overflow-hidden bg-background" dir="rtl">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative pt-20">

                {/* About Us Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-all" />
                        <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="p-2 bg-primary/10 rounded-xl text-lg">📜</span>
                            قصتنا
                        </h3>
                        <p className="text-foreground/50 leading-relaxed text-sm font-medium">
                            بدأت الزتونة كحلم لتبسيط المحتوي الأكاديمي المعقد وتحويله لـ <span className="text-white">"زتونة"</span> مركزة تفهمها في دقائق. إحنا هنا عشان ننهي عصر <span className="text-red-400">"الحشو"</span> ونبدأ عصر <span className="text-primary italic">"الفهم"</span> بأقل مجهود ممكن.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-secondary/20 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-secondary/20 transition-all" />
                        <h3 className="text-xl font-black text-secondary mb-6 flex items-center gap-3">
                            <span className="p-2 bg-secondary/10 rounded-xl text-lg">🎯</span>
                            رؤيتنا وهدفنا
                        </h3>
                        <p className="text-foreground/50 leading-relaxed text-sm font-medium">
                            هدفنا هو تمكين زمايلنا في قسم <span className="text-secondary">تكنولوجيا المعلومات (IT)</span> في <span className="text-white">جامعة برج العرب التكنولوجية</span> من التميز. إحنا السند الأكاديمي والتقني الأول ليك عشان توصل لأهدافك بروح أخوية وعصرية.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 overflow-hidden"
                    >
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                            <span className="p-2 bg-white/5 rounded-xl text-lg">💻</span>
                            تيم التقنيات
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {TECH_STACK.map((tech) => (
                                <span
                                    key={tech.name}
                                    className={`${tech.color} px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/[0.05] hover:scale-105 transition-transform cursor-default`}
                                >
                                    {tech.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] text-foreground/30 font-bold leading-tight uppercase tracking-widest pt-4 border-t border-white/[0.05]">
                            بناء عالي الدقة باستخدام تقنيات الـ Core والذكاء الاصطناعي.
                        </p>
                    </motion.div>
                </div>

                {/* Feedback Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-20 border-t border-white/[0.03]">
                    <div className="space-y-10 group">
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20"
                            >
                                Feedback & Suggestions
                            </motion.span>
                            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter">
                                شكراً لأنك شريك <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary/60 to-secondary italic">في نجاح الزتونة! 🫒</span>
                            </h2>
                            <p className="text-foreground/40 text-lg md:text-xl font-medium max-w-md">
                                رأيك هو البوصلة اللي بتوجهنا.. سيب بصمتك وساعدنا نكبر أكتر.
                            </p>
                        </div>

                        <div className="hidden md:flex gap-12 pt-4">
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-white">+500</p>
                                <p className="text-[10px] text-foreground/30 font-black tracking-widest uppercase">طالب نشط</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-white">100%</p>
                                <p className="text-[10px] text-foreground/30 font-black tracking-widest uppercase">دعم تعليمي</p>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Form Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/10 blur-3xl opacity-50 -z-10" />
                        <form
                            onSubmit={handleWhatsAppSubmit}
                            className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 space-y-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                        >
                            {/* Inner Decorative Line */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                            <h4 className="text-2xl font-black text-center mb-8 flex items-center justify-center gap-3">
                                <span className="text-primary text-3xl">📝</span>
                                نموذج التطوير
                            </h4>

                            {/* Star Rating Enhanced */}
                            <div className="flex flex-col items-center gap-4 py-6 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-inner">
                                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em]">قيم تجربتك الأكاديمية</span>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-4xl transition-all duration-300 transform ${star <= rating ? "text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" : "text-white grayscale opacity-20 hover:opacity-100 hover:scale-105"}`}
                                        >
                                            {star <= rating ? "★" : "☆"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pr-2">الاسم بالكامل</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="اكتب اسمك هنا.."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all shadow-inner"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pr-2">رقم التليفون</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="01xxxxxxxxx"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all shadow-inner"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pr-2"> الاقتراحات والشكاوى 💡</label>
                                <textarea
                                    placeholder="اكتب كل اللي في بالك هنا، بنقرأ كل كلمة بجد.."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all min-h-[140px] shadow-inner resize-none"
                                    value={formData.suggestions}
                                    onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full group relative overflow-hidden bg-primary text-black font-black py-5 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 flex items-center gap-3 text-lg">
                                    إرسال الزتونة 🚀
                                </span>
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Bottom Footer bar */}
                <div className="mt-20 py-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] text-foreground/20 font-black uppercase tracking-[0.4em]">
                    <p className="hover:text-foreground/40 transition-colors cursor-default">© 2026 AZ-ZAITOUNA | THE INDEPENDENT STUDENT INITIATIVE</p>
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-4 group cursor-default">
                            BUILT WITH <span className="text-secondary group-hover:scale-125 transition-transform">❤</span> FOR IT STUDENTS
                        </span>
                        <div className="flex gap-4">
                            <span className="w-1 h-1 bg-primary rounded-full" />
                            <span className="w-1 h-1 bg-secondary rounded-full" />
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
