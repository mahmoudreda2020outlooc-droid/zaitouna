"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const subjects = [
    { title: "Web Programming II", icon: "🌐", code: "WEB-201", progress: 65, color: "rgba(0, 242, 255, 0.5)", delay: "0.1s", summary: "تطوير تطبيقات الويب **المتقدمة** باستخدام **أحدث التقنيات**." },
    { title: "Database programming 2", icon: "🗄️", code: "DB-202", progress: 40, color: "rgba(34, 197, 94, 0.5)", delay: "0.2s", summary: "إدارة وقواعد البيانات **المتقدمة** وبرمجتها بشكل **احترافي**." },
    { title: "CCNA", icon: "🔌", code: "NET-301", progress: 20, color: "rgba(168, 85, 247, 0.5)", delay: "0.3s", summary: "أساسيات الشبكات والتحقق من الشهادات **العالمية** لـ **Cisco**." },
    { title: "Data Structure", icon: "🌳", code: "DS-401", progress: 10, color: "rgba(249, 115, 22, 0.5)", delay: "0.4s", summary: "هياكل البيانات والخوارزميات البرمجية **المعقدة**." },
    { title: "Java", icon: "☕", code: "JAV-110", progress: 85, color: "rgba(239, 68, 68, 0.5)", delay: "0.5s", summary: "برمجة الكائنات (**OOP**) باستخدام لغة جافا **القوية**." },
    { title: "الرسم الهندسي", icon: "📐", code: "DRW-102", progress: 50, color: "rgba(59, 130, 246, 0.5)", delay: "0.6s", summary: "أساسيات وتطبيقات الرسم الهندسي **الفني** و**المعماري**." },
];

const renderTextWithHighlights = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    const highlighterColors = ['#fbbf24', '#00f2ff', '#bd65ff', '#4ade80'];

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const color = highlighterColors[i % highlighterColors.length];
            return (
                <span
                    key={i}
                    className="premium-highlighter inline-block mx-1 leading-none"
                    style={{ '--hl-color': color } as React.CSSProperties}
                >
                    {part.slice(2, -2)}
                </span>
            );
        }
        return part;
    });
};

export default function SubjectsPage() {
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 font-[Outfit,system-ui,sans-serif]" dir="rtl">
            {/* Background mesh */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,242,255,0.05),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(189,101,255,0.05),transparent_50%)] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 animate-in slide-in-from-top-4 duration-700">
                    <div>
                        <Link href="/" className="text-primary/70 hover:text-primary mb-4 inline-block transition-colors text-sm font-bold flex items-center gap-2">
                            <span>←</span> العودة للرئيسية
                        </Link>
                        <h1 className="text-2xl md:text-5xl font-black tracking-tight mb-2">
                            زتونة <span className="text-gradient">المواد</span>
                        </h1>
                        <p className="text-white/50 text-sm md:text-base">هنا تلاقي الخلاصة لكل مادة دراسية شايل همها.</p>
                    </div>

                    <div className="glass-card px-6 py-4 flex items-center gap-4 border-white/5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm text-white/40 font-bold uppercase tracking-wider">الطالب</div>
                            <div className="font-bold text-white/90">{user.name}</div>
                        </div>
                    </div>
                </div>

                {/* Subjects List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((subject, idx) => (
                        <Link
                            href={`/subjects/${subject.code}`}
                            key={idx}
                            className="glass-card p-6 md:p-8 group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 border-white/5 hover:border-primary/30 hover:shadow-[0_10px_40px_rgba(0,242,255,0.1)] relative overflow-hidden flex flex-col items-start text-right min-h-[280px] md:min-h-[300px] cursor-pointer"
                            style={{ animationDelay: subject.delay }}
                        >
                            {/* Card glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 group-hover:bg-primary/20 transition-colors shadow-inner border border-white/5">
                                {subject.icon}
                            </div>

                            <div className="mb-auto">
                                <h3 className="text-xl md:text-2xl font-black mb-4 group-hover:text-primary transition-colors">{subject.title}</h3>
                                <p className="text-white/40 text-[13px] md:text-sm leading-relaxed mb-6 group-hover:text-white/60 transition-colors">{renderTextWithHighlights(subject.summary)}</p>
                            </div>


                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .text-gradient {
          background: linear-gradient(135deg, #00f2ff 0%, #bd65ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-card {
           background: rgba(255, 255, 255, 0.03);
           backdrop-filter: blur(12px);
           border-radius: 24px;
           border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
        </main>
    );
}
