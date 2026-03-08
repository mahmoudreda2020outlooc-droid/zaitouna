"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import lecturesData from "../../../../data/lectures.json";

type QuizQuestion = {
    type: "mcq" | "tf" | "fitb";
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
    topic?: string;
};

type Lecture = {
    id: string;
    subjectId: string;
    lectureId: string;
    title: string;
    summary: string;
    quiz?: QuizQuestion[];
    sheetSolutions?: { question: string; answer: string; explanation: string }[];
    resources: {
        pdf: string;
        sheet: string;
        assignments: string;
    };
};

// --- Enhanced Summary Renderer Component ---
const SummaryRenderer = ({ content }: { content: string }) => {
    const lines = content.split('\n');
    let currentSection: any[] = [];
    const sections: any[] = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('###')) {
            if (currentSection.length > 0) sections.push([...currentSection]);
            currentSection = [{ type: 'heading', content: trimmed.replace(/^###\s*/, ''), id: index }];
        } else if (trimmed.startsWith('*')) {
            currentSection.push({ type: 'list', content: trimmed.replace(/^\*\s*/, ''), id: index });
        } else if (trimmed !== '') {
            currentSection.push({ type: 'paragraph', content: trimmed, id: index });
        }
    });
    if (currentSection.length > 0) sections.push(currentSection);

    const renderText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        const highlighterColors = ['#fbbf24', '#00f2ff', '#bd65ff', '#4ade80'];

        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const color = highlighterColors[i % highlighterColors.length];
                return (
                    <span
                        key={i}
                        className="premium-highlighter inline-block mx-1 leading-none"
                        style={{ '--hl-color': color } as any}
                    >
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="space-y-12">
            {sections.map((section, sIdx) => {
                const heading = section.find((item: any) => item.type === 'heading');
                const others = section.filter((item: any) => item.type !== 'heading');

                return (
                    <div key={sIdx} className="relative group">
                        {heading && (
                            <div className="flex items-center gap-4 mb-8">
                                <span className="flex-none w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-amber-500/20 ring-4 ring-amber-500/10">
                                    {sIdx + 1}
                                </span>
                                <h3 className="text-2xl font-black text-white tracking-tight glow-text-sm">
                                    {heading.content}
                                </h3>
                                <div className="h-[2px] flex-1 bg-gradient-to-l from-white/10 to-transparent rounded-full ml-4"></div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 pr-6">
                            {others.map((item: any, iIdx: number) => (
                                <div
                                    key={item.id}
                                    className={`
                                        ${item.type === 'list'
                                            ? 'bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.1] transition-all hover:translate-x-[-4px]'
                                            : 'mb-4 text-white/70'} 
                                        animate-in fade-in slide-in-from-right-4 duration-500
                                    `}
                                    style={{ animationDelay: `${(sIdx * 200) + (iIdx * 50)}ms` }}
                                >
                                    {item.type === 'list' ? (
                                        <div className="flex gap-4">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                            <div className="flex-1 leading-relaxed text-sm md:text-base font-medium">
                                                {renderText(item.content)}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="leading-relaxed text-sm md:text-base font-medium pr-2">
                                            {renderText(item.content)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function LectureDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const subjectId = params.subjectId as string;
    const lectureId = params.lectureId as string;

    const lecture = (lecturesData as Lecture[]).find((l: Lecture) => l.subjectId === subjectId && l.lectureId === lectureId);

    if (!lecture) return <div className="text-white text-center py-20 font-black">المحاضرة مش موجودة يا بطل...</div>;

    return (
        <main className="min-h-screen lecture-bg pb-20 overflow-x-hidden" dir="rtl">
            {/* ─── Header Part ─── */}
            <header className="relative pt-24 pb-16 px-6 text-center">
                <div className="absolute top-10 left-10">
                    <Link href="/" className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-black text-sm hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-xl shadow-lg shadow-black/20">
                        الرئيسية
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto mt-12 md:mt-0">
                    <h1 className="text-4xl md:text-6xl font-black text-white glow-heading mb-8 tracking-tight leading-[1.2] pb-2">
                        {lecture.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <span className="glass-pill px-6 py-2 text-xs md:text-sm text-cyan-400 font-black uppercase tracking-[0.3em] shadow-inner">
                            {subjectId.split('-')[0]}
                        </span>
                        <span className="glass-pill px-6 py-2 text-xs md:text-sm text-amber-500 font-black uppercase tracking-[0.3em] shadow-inner">
                            {lectureId.replace('lecture_', 'المحاضرة ')}
                        </span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* ─── Right Column: Summary (8/12) ─── */}
                    <div className="lg:col-span-8 space-y-10">
                        <section className="friendly-card p-6 md:p-12 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="heading-accent !h-8 w-1.5"></div>
                                <h2 className="text-3xl font-black sub-glow-heading tracking-tight">الزتونة (ملخص المحاضرة) 🫒</h2>
                            </div>
                            <SummaryRenderer content={lecture.summary} />
                        </section>
                    </div>

                    {/* ─── Left Column: Sidebar (4/12) ─── */}
                    <aside className="lg:col-span-4 space-y-5 sticky top-8">
                        <div className="flex items-center gap-3 mb-3 px-3">
                            <div className="heading-accent !h-5 !w-1"></div>
                            <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">المصادر والشيتات</h2>
                        </div>

                        <div className="space-y-3">
                            <a href={lecture.resources.pdf} target="_blank" className="resource-card pdf-card group">
                                <div className="resource-icon bg-red-500/10 text-red-500">📄</div>
                                <div className="text-right flex-1">
                                    <h3 className="text-white font-black text-base group-hover:text-red-400 transition-colors">pdf المحاضرة</h3>
                                    <p className="text-white/30 text-[11px] font-bold uppercase tracking-wider">PDF SLIDES</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                </div>
                            </a>

                            <a href={lecture.resources.sheet} target="_blank" className="resource-card sheet-card group">
                                <div className="resource-icon bg-green-500/10 text-green-500">📝</div>
                                <div className="text-right flex-1">
                                    <h3 className="text-white font-black text-base group-hover:text-green-400 transition-colors">شيت الأسئلة</h3>
                                    <p className="text-white/30 text-[11px] font-bold uppercase tracking-wider">WORKSHEET</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                </div>
                            </a>

                            <Link href={`/subjects/${subjectId}/${lectureId}/sheet`} className="flex items-center gap-5 p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-amber-500/20 transition-all duration-300 group cursor-pointer hover:scale-[1.02] hover:-translate-x-1 relative overflow-hidden">
                                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center text-[28px] bg-amber-500/10 shrink-0">🤖</div>
                                <div className="text-right flex-1">
                                    <h3 className="text-white font-black text-base group-hover:text-amber-400 transition-colors">حل الشيت</h3>
                                    <p className="text-white/30 text-[11px] font-bold uppercase tracking-wider">AI SOLVER</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                </div>
                            </Link>

                            {lecture.resources.assignments && lecture.resources.assignments !== "#" ? (
                                <a href={lecture.resources.assignments} target="_blank" className="resource-card assign-card group">
                                    <div className="resource-icon bg-cyan-500/10 text-cyan-500">⚡</div>
                                    <div className="text-right flex-1">
                                        <h3 className="text-white font-black text-base group-hover:text-cyan-400 transition-colors">المهام المطلوبة</h3>
                                        <p className="text-white/30 text-[11px] font-bold uppercase tracking-wider">SUBMISSIONS</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                </a>
                            ) : (
                                <div className="resource-card opacity-40 cursor-not-allowed group grayscale">
                                    <div className="resource-icon bg-white/5 text-white/20">⚡</div>
                                    <div className="text-right flex-1">
                                        <h3 className="text-white/40 font-black text-base">المهام المطلوبة</h3>
                                        <p className="text-white/20 text-[11px] font-bold uppercase tracking-wider">لا يوجد</p>
                                    </div>
                                </div>
                            )}

                            <Link href={`/subjects/${subjectId}/${lectureId}/quiz`} className="flex flex-col items-center justify-between p-8 rounded-[40px] bg-gradient-to-b from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/15 hover:border-indigo-400/40 transition-all duration-500 group cursor-pointer hover:scale-[1.02] relative overflow-hidden min-h-[300px] text-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative z-10 w-full mb-4">
                                    <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                        CHALLENGE
                                    </div>
                                    <h3 className="text-white font-black text-2xl group-hover:text-indigo-400 transition-colors mb-2">اختبر نفسك</h3>
                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                                        تحدى نفسك وشوف مستواك الحقيقي في المحاضرة دي مع الدحيح!
                                    </p>
                                </div>

                                <div className="relative z-10 w-48 h-48 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 ease-out">
                                    <img
                                        src="/images/premium_trophy_challenge.png"
                                        alt="Trophy"
                                        className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)]"
                                    />
                                </div>

                                <div className="relative z-10 w-full mt-6">
                                    <div className="w-full py-4 rounded-2xl bg-indigo-500 text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-400 transition-colors">
                                        ابدأ التحدي الآن
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            <style jsx>{`
                .lecture-bg {
                    background: #06060c;
                    background-image: radial-gradient(circle at 100% 0%, rgba(245,158,11,0.07) 0%, transparent 50%),
                                      radial-gradient(circle at 0% 100%, rgba(6,182,212,0.05) 0%, transparent 50%);
                }
                .glass-pill {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 99px;
                    backdrop-blur: 8px;
                }
                .friendly-card {
                    background: rgba(255,255,255,0.015);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 48px;
                    box-shadow: 0 4px 24px -1px rgba(0,0,0,0.2);
                    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .friendly-card:hover {
                    background: rgba(255,255,255,0.025);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
                }
                .resource-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 24px;
                    border-radius: 32px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    cursor: pointer;
                    text-decoration: none;
                    position: relative;
                    overflow: hidden;
                }
                .resource-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s;
                }
                .resource-card:hover::before {
                    transform: translateX(100%);
                }
                .resource-card:hover {
                    background: rgba(255,255,255,0.04);
                    transform: scale(1.02) translateX(-4px);
                    border-color: rgba(255,255,255,0.12);
                }
                .pdf-card:hover { border-right: 4px solid #ef4444; }
                .sheet-card:hover { border-right: 4px solid #22c55e; }
                .solve-card:hover { border-right: 4px solid #f59e0b; }
                .assign-card:hover { border-right: 4px solid #06b6d4; }
                .quiz-card:hover { border-right: 4px solid #818cf8; }

                .resource-icon {
                    width: 56px; height: 56px;
                    border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px;
                    flex-shrink: 0;
                    background: rgba(255,255,255,0.04);
                }
                .glow-heading {
                    background: linear-gradient(to right, #fff, #9ca3af);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .heading-accent {
                    background: #f59e0b;
                    box-shadow: 0 0 20px rgba(245,158,11,0.5);
                    border-radius: 99px;
                }
                .sub-glow-heading {
                    color: white;
                    text-shadow: 0 0 30px rgba(255,255,255,0.15);
                }
                .glow-text-sm {
                   text-shadow: 0 0 15px rgba(255,255,255,0.1);
                }
            `}</style>
        </main>
    );
}
