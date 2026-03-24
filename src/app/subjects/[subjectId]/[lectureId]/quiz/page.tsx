"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import lecturesData from "@/data/lectures.json";

interface Question {
    type: string;
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
    topic: string;
    pageHint?: string;
    question_ar?: string;
    options_ar?: string[];
    answer_ar?: string;
    explanation_ar?: string;
}

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.subjectId as string;
    const lectureId = params.lectureId as string;

    const [lecture, setLecture] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        const found = (lecturesData as any[]).find(l => l.subjectId === subjectId && l.lectureId === lectureId);
        if (found) {
            setLecture(found);
        } else {
            router.push(`/subjects/${subjectId}/${lectureId}`);
        }
    }, [subjectId, lectureId, router]);

    const activeQuiz = useMemo(() => {
        if (!lecture || !lecture.quiz) return [];
        return lecture.quiz;
    }, [lecture]);

    const handleNext = () => {
        const currentQ = activeQuiz[currentQuestionIndex];
        if (!currentQ) return;

        let isCorrect = false;
        if (currentQ.type === "mcq" || currentQ.type === "tf") {
            isCorrect = selectedAnswer?.toLowerCase() === currentQ.answer?.toLowerCase();
        } else if (currentQ.type === "fitb") {
            isCorrect = selectedAnswer?.trim().toLowerCase() === currentQ.answer?.trim().toLowerCase();
        } else if (currentQ.type === "essay") {
            isCorrect = true;
        }

        const newUserAnswers = [...userAnswers, {
            ...currentQ,
            userAnswer: selectedAnswer,
            isCorrect
        }];

        setUserAnswers(newUserAnswers);

        if (currentQuestionIndex < activeQuiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowTranslation(false);
            setTranslationError(null);
        } else {
            setIsQuizFinished(true);
        }
    };

    const toggleTranslation = () => {
        setShowTranslation(!showTranslation);
    };

    const getStudyPlan = () => {
        const mistakes = userAnswers.filter(a => !a.isCorrect);
        if (mistakes.length === 0) return "عظمة يا بطل! إنت مقفل المحاضرة دي حرفياً. مفيش جزء محتاج تراجعه، إنت جاهز للي بعده! 🚀";

        const topicMap: Record<string, Set<string>> = {};
        mistakes.forEach(m => {
            if (!topicMap[m.topic]) topicMap[m.topic] = new Set();
            if (m.pageHint) topicMap[m.topic].add(m.pageHint);
        });

        const planLines = Object.entries(topicMap).map(([topic, pages]) => {
            const pageStr = pages.size > 0 ? ` (راجع سلايد: ${Array.from(pages).join(', ')})` : "";
            return `• **${topic}**${pageStr}`;
        });

        return `يا بطل، أنت أداءك بطل بس فيه كام لقطة محتاجين "زتونة" زيادة. ركز في المراجعة على الأجزاء دي:\n${planLines.join('\n')}\n\nدايماً فاكر إن "الدحيح" معاك، راجع دول وارجع جرب تاني! 🫒💎`;
    };

    if (!lecture) return <div className="min-h-screen bg-[#080810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

    if (isQuizFinished) {
        const score = userAnswers.filter(a => a.isCorrect).length;
        const percentage = Math.round((score / activeQuiz.length) * 100);

        return (
            <main className="min-h-screen bg-[#080810] text-white p-6 md:p-12" dir="rtl">
                <div className="max-w-4xl mx-auto space-y-12">
                    <header className="text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-4">النتيجة النهائية 🏆</h1>
                        <div className="flex justify-center gap-8">
                            <div className="text-center text-amber-500"><div className="text-5xl font-black">{score}/{activeQuiz.length}</div><div className="text-xs uppercase">SCORE</div></div>
                            <div className="text-center text-cyan-500"><div className="text-5xl font-black">{percentage}%</div><div className="text-xs uppercase">ACCURACY</div></div>
                        </div>
                    </header>

                    <section className="friendly-card p-8 bg-amber-500/5">
                        <h2 className="text-2xl font-black text-amber-500 mb-4">زتونة المراجعة 🫒</h2>
                        <div className="text-lg text-white/80 whitespace-pre-line">{getStudyPlan()}</div>
                    </section>

                    <div className="space-y-4">
                        {userAnswers.map((item, idx) => (
                            <div key={idx} className={`friendly-card p-6 ${item.isCorrect ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                                <div className="space-y-3">
                                    <p className="text-lg font-bold">{idx + 1}. {showTranslation && item.question_ar ? item.question_ar : item.question}</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                        <div className="p-3 bg-white/5 rounded-xl"><p className="text-white/40">إجابتك:</p><p className={item.isCorrect ? 'text-green-400' : 'text-red-400'}>{item.userAnswer || "لم تجب"}</p></div>
                                        <div className="p-3 bg-white/5 rounded-xl"><p className="text-white/40">الصح:</p><p className="text-green-400">{showTranslation && item.answer_ar ? item.answer_ar : item.answer}</p></div>
                                    </div>
                                    <p className="text-sm text-white/50 italic mt-2">💡 {showTranslation && item.explanation_ar ? item.explanation_ar : item.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center flex-col items-center gap-6">
                        <button onClick={() => setShowTranslation(!showTranslation)} className="text-amber-500 font-bold border-b border-amber-500/20">{showTranslation ? "عرض بالإنجليزي" : "ترجمة الشرح بالكامل"}</button>
                        <Link href={`/subjects/${subjectId}/${lectureId}`} className="px-12 py-5 rounded-3xl bg-white/10 hover:bg-white/20 font-black text-lg transition-all border border-white/10">العودة للمحاضرة</Link>
                    </div>
                </div>
            </main>
        );
    }

    const currentQ = activeQuiz[currentQuestionIndex];
    if (!currentQ) return null;

    return (
        <main className="min-h-screen bg-[#080810] text-white flex flex-col" dir="rtl">
            <header className="p-6 flex items-center justify-between">
                <Link href={`/subjects/${subjectId}/${lectureId}`} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">✕</Link>
                <div className="flex-1 max-w-sm mx-8">
                    <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-amber-500">{currentQuestionIndex + 1} / {activeQuiz.length}</span><span className="text-white/20 uppercase">{lecture.title}</span></div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.length) * 100}%` }}></div></div>
                </div>
                <div className="w-10 h-10"></div>
            </header>

            <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div className="w-full max-w-4xl space-y-12 animate-in zoom-in-95 duration-500">
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">{currentQ.topic}</div>
                        <h2 className="text-xl md:text-3xl font-black leading-tight max-w-4xl mx-auto min-h-[4rem] flex items-center justify-center">
                            {showTranslation && currentQ.question_ar ? currentQ.question_ar : currentQ.question}
                        </h2>

                        <button
                            onClick={toggleTranslation}
                            className={`flex items-center gap-2 mx-auto px-6 py-2 rounded-2xl border transition-all ${showTranslation ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-white/60 border-white/10'}`}
                        >
                            <span className="text-lg">🌍</span>
                            <span className="font-bold text-xs uppercase">{showTranslation ? "عرض بالإنجليزي" : "ترجمة (عربي)"}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {currentQ.type === "mcq" && currentQ.options?.map((option: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedAnswer(option)}
                                className={`p-5 rounded-2xl text-right border-2 transition-all ${selectedAnswer === option ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'}`}
                            >
                                <span className="font-bold">{showTranslation && currentQ.options_ar?.[idx] ? currentQ.options_ar[idx] : option}</span>
                            </button>
                        ))}

                        {currentQ.type === "tf" && ['true', 'false'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setSelectedAnswer(option)}
                                className={`p-8 rounded-3xl text-center border-2 transition-all ${selectedAnswer === option ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/5 text-white/70'}`}
                            >
                                <span className="text-2xl font-black uppercase">{showTranslation ? (option === 'true' ? 'صح' : 'خطأ') : option}</span>
                            </button>
                        ))}
                    </div>

                    {currentQ.type === "fitb" && <input type="text" value={selectedAnswer || ""} onChange={(e) => setSelectedAnswer(e.target.value)} placeholder={showTranslation ? "اكتب الحل هنا..." : "Type answer here..."} className="w-full max-w-md p-5 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-amber-500 outline-none text-center text-xl font-bold transition-all" />}
                    {currentQ.type === "essay" && <textarea value={selectedAnswer || ""} onChange={(e) => setSelectedAnswer(e.target.value)} placeholder={showTranslation ? "اكتب شرحك هنا..." : "Write your explanation here..."} rows={4} className="w-full max-w-2xl p-5 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-amber-500 outline-none text-right text-lg font-medium transition-all" />}

                    <div className="pt-8">
                        <button
                            disabled={!selectedAnswer}
                            onClick={handleNext}
                            className={`px-16 py-4 rounded-3xl font-black text-xl transition-all ${selectedAnswer ? 'bg-white text-black hover:scale-105 shadow-xl shadow-white/10' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}
                        >
                            {currentQuestionIndex === activeQuiz.length - 1 ? 'إنهاء التحدي 🏁' : 'السؤال التالي ➡️'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .friendly-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 32px;
                }
            `}</style>
        </main>
    );
}
