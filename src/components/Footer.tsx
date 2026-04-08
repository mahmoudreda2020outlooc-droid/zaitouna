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
        <footer className="relative mt-24 pb-12 border-t border-white/5 pt-16 bg-background/50 backdrop-blur-md" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* About Us Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-right">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-primary mb-6">قصتنا 📜</h3>
                        <p className="text-foreground/60 leading-relaxed text-sm md:text-base">
                            بدأت الزتونة كحلم لتبسيط المحتوي الأكاديمي المعقد وتحويله لـ "زتونة" مركزة تفهمها في دقائق. إحنا هنا عشان ننهي عصر "الحشو" ونبدأ عصر "الفهم" بأقل مجهود ممكن.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-secondary mb-6">رؤيتنا وهدفنا 🎯</h3>
                        <p className="text-foreground/60 leading-relaxed text-sm md:text-base">
                            هدفنا هو تمكين طالب تكنولوجيا المعلومات من التميز الأكاديمي بأدوات ذكية. رؤيتنا أن نكون المنصة الأولى في مصر التي تدعم الطالب علمياً وتكنولوجياً بروح شبابية.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white mb-6">تيم التقنيات 💻</h3>
                        <div className="flex flex-wrap gap-2">
                            {TECH_STACK.map((tech) => (
                                <span key={tech.name} className={`${tech.color} px-4 py-2 rounded-xl text-xs font-bold border border-white/5`}>
                                    {tech.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-foreground/40 font-medium pt-4 border-t border-white/5">
                            تم البناء باستخدام أحدث تقنيات الويب والذكاء الاصطناعي لضمان أفضل تجربة مستخدم.
                        </p>
                    </div>
                </div>

                <hr className="border-white/5 mb-20" />

                {/* Feedback Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">شكراً لأنك شريك <br /><span className="text-primary italic">في نجاح الزتونة! 🫒</span></h2>
                            <p className="text-foreground/50 text-lg">رأيك هو اللي بيطورنا ويخلينا مستمرين.. كلمنا ومتترددش.</p>
                        </div>
                    </div>

                    {/* Feedback Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onSubmit={handleWhatsAppSubmit}
                        className="glass-card p-8 space-y-6 border-white/10"
                    >
                        <h4 className="text-xl font-black text-center mb-4">نموذج الاقتراحات والشكاوى 📝</h4>

                        {/* Star Rating */}
                        <div className="flex flex-col items-center gap-3 mb-6">
                            <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest">قيم تجريبتك</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-3xl transition-all ${star <= rating ? "scale-110 grayscale-0" : "grayscale opacity-20 hover:opacity-100"}`}
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold pr-2">الاسم بالكامل</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="اكتب اسمك هنا.."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold pr-2">رقم التليفون</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="01xxxxxxxxx"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold pr-2">الرقم الأكاديمي (اختياري)</label>
                            <input
                                type="text"
                                placeholder="رقم الطالب..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                value={formData.academicId}
                                onChange={(e) => setFormData({ ...formData, academicId: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold pr-2">عندك اقتراح إيه؟ 💡</label>
                            <textarea
                                placeholder="اكتب اقتراحك هنا.."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all min-h-[80px]"
                                value={formData.suggestions}
                                onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold pr-2 text-red-400">أي شكاوى؟ ⚠️</label>
                            <textarea
                                placeholder="لو فيه مشكلة واجهتك قولنا.."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-400/50 outline-none transition-all min-h-[80px]"
                                value={formData.complaints}
                                onChange={(e) => setFormData({ ...formData, complaints: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-primary-light text-black font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            إرسال عبر واتساب 🚀
                        </button>
                    </motion.form>
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-foreground/30 font-bold uppercase tracking-[0.2em]">
                    <p>© 2026 AZ-ZAITOUNA | INDEPENDENT STUDENT INITIATIVE</p>
                    <p className="flex gap-4">
                        <span>Built by the Zaitouna Team</span>
                        <span className="text-primary">●</span>
                        <span>For IT Students</span>
                    </p>
                </div>
            </div>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 32px;
                }
            `}</style>
        </footer>
    );
}
