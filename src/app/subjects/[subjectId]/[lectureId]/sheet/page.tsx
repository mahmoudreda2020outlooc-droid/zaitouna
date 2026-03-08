"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import lecturesData from "../../../../../data/lectures.json";

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
    resources?: { pdf?: string; sheet?: string; assignments?: string };
    quiz?: QuizQuestion[];
    sheetSolutions?: { question: string; answer: string; explanation: string, type?: string, pdfPage?: number }[];
};

const getQuestionTypeLabel = (q: any, isQuizFallback: boolean = false) => {
    // 1. Normalized explicit type check (from quiz array or tagged solutions)
    const typeStr = (q.type || '').toLowerCase().trim();
    if (['mcq', 'multiple_choice', 'multiple choice', 'اختياري'].includes(typeStr)) return 'اختياري';
    if (['tf', 'true_false', 'true/false', 't/f', 'صح وخطأ'].includes(typeStr)) return 'صح وخطأ';
    if (['fitb', 'fill_in_the_blanks', 'أكمل'].includes(typeStr)) return 'أكمل';
    if (['essay', 'مقالى'].includes(typeStr)) return 'مقالى';

    // 2. Explicit options array
    if (q.options && Array.isArray(q.options) && q.options.length > 0) return 'اختياري';

    // 3. Heuristics on the question text
    const text = (q.question || '').toLowerCase();

    // MCQ indicators — common patterns in Arabic exam sheets
    if (
        /which of the following/i.test(text) ||
        /أي مما يلي/i.test(text) ||
        /أيهما يمثل/i.test(text) ||
        /اختر\s*(الإجابة|الصحيح)/i.test(text) ||
        /\n\s*[a-d]\)\s/.test('\n' + q.question) ||   // A) B) C) D) on separate lines
        /\n\s*[أ-د]\)\s/.test('\n' + q.question)
    ) return 'اختياري';

    // Fill-in-the-blank indicators
    if (/\.{4,}/.test(q.question) || /_{3,}/.test(q.question) || /أكمل|اكمل|complete/.test(text)) return 'أكمل';

    // True/False indicators
    if (/true or false|صح أم خطأ|صح او خطأ|correct or incorrect/i.test(text)) return 'صح وخطأ';
    if (q.answer && /^(true|false|صح|خطأ|correct|incorrect)$/i.test((q.answer || '').trim())) return 'صح وخطأ';

    return 'مقالى';
};


const getTypeColor = (label: string) => {
    switch (label) {
        case "اختياري": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        case "صح وخطأ": return "text-green-400 bg-green-400/10 border-green-400/20";
        case "أكمل": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
        default: return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    }
};

export default function SheetSolverPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    const [sheetMessages, setSheetMessages] = useState<{ role: 'user' | 'assistant'; content: string | React.ReactNode }[]>([]);
    const [sheetInput, setSheetInput] = useState('');
    const [isSheetLoading, setIsSheetLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const subjectId = params.subjectId as string;
    const lectureId = params.lectureId as string;

    const lecture = (lecturesData as Lecture[]).find((l: Lecture) => l.subjectId === subjectId && l.lectureId === lectureId);

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

    useEffect(() => {
        if (sheetMessages.length === 0 && lecture) {
            const welcomeMsg = {
                role: 'assistant' as const,
                content: `يا هلا يا بطل! 👋 أنا الدحيح وده حل الشيت بتاع "${lecture?.title}" كامل وجاهز ليك. ذاكرهم كويس ولو فيه أي نقطة مش واضحة أسألني فوراً:`
            };
            setSheetMessages([welcomeMsg]);
        }
    }, [lecture, sheetMessages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [sheetMessages, isSheetLoading]);

    const handleSheetSend = async () => {
        if (!sheetInput.trim() || isSheetLoading) return;

        const userMsg = sheetInput.trim();
        setSheetInput('');
        setSheetMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsSheetLoading(true);

        try {
            const res = await fetch('/api/solve-sheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMsg,
                    subjectId,
                    lectureId,
                    context: lecture?.summary
                })
            });

            const data = await res.json();
            setSheetMessages(prev => [...prev, { role: 'assistant', content: data.answer || "معلش يا بطل، حصلت مشكلة وعقلي وقف لحظة. جرب تسأل تاني!" }]);
        } catch (error) {
            setSheetMessages(prev => [...prev, { role: 'assistant', content: "النت شكله بيفصل ولا إيه؟ جرب تسأل تاني يا بطل!" }]);
        } finally {
            setIsSheetLoading(false);
        }
    };

    if (!user) return null;
    if (!lecture) return <div className="text-white text-center py-20 font-black">المحاضرة مش موجودة يا بطل...</div>;

    return (
        <main className="min-h-screen bg-[#06060c] overflow-x-hidden relative" dir="rtl">
            {/* ─── Header Part ─── */}
            <header className="relative pt-8 pb-6 px-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl z-20 sticky top-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/subjects/${subjectId}/${lectureId}`} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-white/70 hover:text-white group">
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-white glow-heading tracking-tight">
                                الدحيح — حل الشيت
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-white/40 uppercase tracking-widest">{subjectId.split('-')[0]}</span>
                                <span className="text-white/20 text-xs">•</span>
                                <span className="text-xs text-amber-500 font-bold uppercase">{lectureId.replace('lecture_', 'المحاضرة ')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card px-4 py-2 hidden md:flex items-center gap-3 border-white/5 !rounded-2xl">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-black shadow-lg shadow-amber-500/20 text-black">
                            {user.name.charAt(0)}
                        </div>
                        <div className="text-sm font-bold text-white/90">{user.name}</div>
                    </div>
                </div>
            </header>

            {/* ─── Main Content Area ─── */}
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-12 relative z-10">
                {/* Background Decoration */}
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none" />

                <div className="space-y-12">

                    {/* ─── Sheet Solutions Section (Cards) ─── */}
                    <div className="space-y-6">
                        {(lecture?.sheetSolutions && lecture.sheetSolutions.length > 0
                            ? lecture.sheetSolutions
                            : (lecture?.quiz || [])
                        ).map((q: any, idx: number) => {
                            const isQuizFallback = !(lecture?.sheetSolutions && lecture.sheetSolutions.length > 0);
                            const typeLabel = getQuestionTypeLabel(q, isQuizFallback);
                            const typeColor = getTypeColor(typeLabel);

                            return (
                                <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-lg">
                                                {idx + 1}
                                            </div>
                                            <h3 className="font-black text-xl text-white/90">سؤال {idx + 1}</h3>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-black border ${typeColor}`}>
                                            {typeLabel}
                                        </span>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <h4 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                السؤال:
                                            </h4>
                                            <p className="font-bold text-white/90 leading-relaxed text-lg bg-white/5 p-4 rounded-2xl border border-white/5">
                                                {q.question}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                الإجابة النموذجية:
                                            </h4>
                                            <p className="font-bold text-white leading-relaxed text-base bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                                                {q.answer}
                                            </p>
                                        </div>

                                        {q.explanation && (
                                            <div>
                                                <h4 className="text-white/50 font-bold mb-2 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    الزتونة (شرح الحل):
                                                </h4>
                                                <p className="text-white/70 leading-relaxed text-sm bg-black/20 p-4 rounded-2xl border border-white/5">
                                                    {q.explanation}
                                                </p>
                                            </div>
                                        )}

                                        {/* PDF Source Link - Only for Essay questions */}
                                        {lecture?.resources?.pdf && q.type === 'essay' && (
                                            <div className="pt-2 border-t border-white/5">
                                                <a
                                                    href={q.pdfPage ? `${lecture.resources.pdf}#page=${q.pdfPage}` : lecture.resources.pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-amber-400 transition-colors font-bold group/pdf"
                                                >
                                                    <svg className="w-4 h-4 text-red-400/60 group-hover/pdf:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    المصدر: PDF المحاضرة {q.pdfPage ? `(سلايد ${q.pdfPage})` : ''}
                                                    <svg className="w-3 h-3 opacity-0 group-hover/pdf:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .glow-heading {
                    background: linear-gradient(to right, #ffffff, #a1a1aa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </main >
    );
}
