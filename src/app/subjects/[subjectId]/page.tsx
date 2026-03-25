"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import lecturesData from "../../../data/lectures.json";

type Lecture = {
    id: string;
    subjectId: string;
    lectureId: string;
    title: string;
    summary: string;
    resources: { pdf: string; sheet: string; assignments: string };
};

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

export default function SubjectLecturesPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    const subjectId = params.subjectId as string;
    const lectures = (lecturesData as Lecture[])
        .filter((l: Lecture) => l.subjectId === subjectId)
        .sort((a, b) => {
            const numA = parseInt(a.lectureId.replace('lecture_', ''), 10);
            const numB = parseInt(b.lectureId.replace('lecture_', ''), 10);
            return numA - numB;
        });

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await fetch('/api/student-lookup?check=true');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.student);
                } else {
                    router.push("/login");
                }
            } catch (err) {
                router.push("/login");
            }
        };
        checkUser();
    }, [router]);

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-[Outfit,system-ui,sans-serif]" dir="rtl">
            {/* Background mesh */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,242,255,0.05),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(189,101,255,0.05),transparent_50%)] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 animate-in slide-in-from-top-4 duration-700">
                    <div>
                        <Link href="/subjects" className="text-primary/70 hover:text-primary mb-4 inline-block transition-colors text-sm font-bold flex items-center gap-2">
                            <span>←</span> العودة للمواد
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                            محاضرات <span className="text-gradient uppercase tracking-widest">{subjectId.split('-')[0]}</span>
                        </h1>
                        <p className="text-white/50 text-base">اختار المحاضرة واطبع الزتونة في ثواني.</p>
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

                {/* Lectures List or Empty State */}
                {lectures.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4 animate-in fade-in duration-700">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">لم يتم رفعة اى محاضرة حتى الان</h2>
                        <p className="text-white/50 text-base md:text-lg">ترقب الزتونة يصحبى</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {lectures.map((lecture: Lecture, idx: number) => (
                            <Link
                                href={`/subjects/${subjectId}/${lecture.lectureId}`}
                                key={lecture.lectureId}
                                className="glass-card p-6 md:p-8 group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 border-white/5 hover:border-secondary/30 hover:shadow-[0_10px_40px_rgba(168,85,247,0.1)] relative overflow-hidden flex flex-col justify-center min-h-[160px] cursor-pointer"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <h2 className="text-xl md:text-2xl font-black group-hover:text-secondary transition-colors line-clamp-2">
                                        {lecture.title}
                                    </h2>
                                </div>

                                <p className="text-white/50 text-sm leading-relaxed relative z-10 line-clamp-3">
                                    {renderTextWithHighlights(lecture.summary.substring(0, 150) + "...")}
                                </p>

                                {/* Open Icon indicator */}
                                <div className="absolute bottom-6 left-6 text-white/20 group-hover:text-secondary/70 transition-colors text-2xl font-black translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 duration-300">
                                    ←
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
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
        </main >
    );
}
