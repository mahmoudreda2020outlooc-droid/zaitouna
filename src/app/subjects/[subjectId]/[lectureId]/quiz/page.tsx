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
    const [translatedQuestion, setTranslatedQuestion] = useState<string | null>(null);
    const [translatedOptions, setTranslatedOptions] = useState<string[] | null>(null);
    const [translatedAnswer, setTranslatedAnswer] = useState<string | null>(null);
    const [translatedExplanation, setTranslatedExplanation] = useState<string | null>(null);
    const [translationError, setTranslationError] = useState<string | null>(null);

    // Default English state for Arabic questions
    const [englishQuestion, setEnglishQuestion] = useState<string | null>(null);
    const [englishOptions, setEnglishOptions] = useState<string[] | null>(null);
    const [isTranslatingToEnglish, setIsTranslatingToEnglish] = useState(false);


    // Translation for review items
    const [translatedReviewItems, setTranslatedReviewItems] = useState<Record<number, any>>({});
    const [isTranslatingItem, setIsTranslatingItem] = useState<number | null>(null);

    // Initial load
    useEffect(() => {
        const found = lecturesData.find(l => l.subjectId === subjectId && l.lectureId === lectureId);
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
        let isCorrect = false;

        if (currentQ.type === "mcq" || currentQ.type === "tf") {
            isCorrect = selectedAnswer?.toLowerCase() === currentQ.answer?.toLowerCase();
        } else if (currentQ.type === "fitb") {
            isCorrect = selectedAnswer?.trim().toLowerCase() === currentQ.answer?.trim().toLowerCase();
        } else if (currentQ.type === "essay") {
            isCorrect = true; // Essays are considered "passed" once answered
        }

        const newUserAnswers = [...userAnswers, {
            question: englishQuestion || currentQ.question,
            originalQuestion: currentQ.question,
            userAnswer: selectedAnswer,
            correctAnswer: currentQ.answer,
            explanation: currentQ.explanation,
            topic: currentQ.topic,
            type: currentQ.type,
            pageHint: currentQ.pageHint,
            isCorrect
        }];

        setUserAnswers(newUserAnswers);

        if (currentQuestionIndex < activeQuiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowTranslation(false);
            setTranslatedQuestion(null);
            setTranslatedOptions(null);
            setTranslatedAnswer(null);
            setTranslatedExplanation(null);
            setEnglishQuestion(null);
            setEnglishOptions(null);
            setTranslationError(null);
        } else {
            setIsQuizFinished(true);
        }
    };

    const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

    // Auto-translate to English if original is Arabic
    useEffect(() => {
        const currentQ = activeQuiz[currentQuestionIndex];
        if (!currentQ) return;

        // Reset states for new question
        setEnglishQuestion(null);
        setEnglishOptions(null);
        setTranslatedQuestion(null);
        setTranslatedOptions(null);
        setTranslatedAnswer(null);
        setTranslatedExplanation(null);
        setShowTranslation(false);
        setTranslationError(null);

        if (isArabic(currentQ.question)) {
            const fetchEnglish = async () => {
                setIsTranslatingToEnglish(true);
                try {
                    const response = await fetch('/api/translate-quiz', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text: JSON.stringify({
                                question: currentQ.question,
                                options: currentQ.options || [],
                                answer: currentQ.answer,
                                explanation: currentQ.explanation
                            }),
                            type: "quiz_item",
                            targetLang: "en"
                        })
                    });
                    const data = await response.json();

                    if (data.error) {
                        setTranslationError("Automatic English translation failed. Showing original.");
                        console.error("Auto-English translation failed:", data.error);
                    } else {
                        const reply = data.result || "";
                        const cleanReply = reply.replace(/```json|```/g, '').trim();
                        try {
                            const parsed = JSON.parse(cleanReply);
                            setEnglishQuestion(parsed.question);
                            setEnglishOptions(parsed.options);
                        } catch (parseErr) {
                            console.error("JSON Parse error in auto-translation:", cleanReply);
                            // Fallback to result if not JSON
                            setEnglishQuestion(reply);
                        }
                    }
                } catch (err) {
                    console.error("Auto-English translation failed:", err);
                } finally {
                    setIsTranslatingToEnglish(false);
                }
            };
            fetchEnglish();
        }
    }, [currentQuestionIndex, activeQuiz]);



    const translateQuestion = async () => {
        if (translatedQuestion) {
            setShowTranslation(!showTranslation);
            return;
        }

        setIsTranslating(true);
        setTranslationError(null);
        try {
            const currentQ = activeQuiz[currentQuestionIndex];
            const response = await fetch('/api/translate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: JSON.stringify({
                        question: currentQ.question,
                        options: currentQ.options || [],
                        answer: currentQ.answer,
                        explanation: currentQ.explanation
                    }),
                    type: "quiz_item",
                    targetLang: "ar"
                })
            });
            const data = await response.json();
            if (data.error) {
                setTranslationError(data.error);
            } else {
                try {
                    const reply = data.result || "";
                    const cleanReply = reply.replace(/```json|```/g, '').trim();
                    const parsed = JSON.parse(cleanReply);
                    setTranslatedQuestion(parsed.question);
                    setTranslatedOptions(parsed.options);
                    setTranslatedAnswer(parsed.answer);
                    setTranslatedExplanation(parsed.explanation);
                } catch (parseError) {
                    console.error("JSON Parse error:", data.result);
                    setTranslatedQuestion(data.result);
                }
            }
            setShowTranslation(true);
        } catch (error: any) {
            console.error("Translation error:", error);
            setTranslationError(error.message || "حصلت مشكلة وأنا بكلم الدحيح!");
        } finally {
            setIsTranslating(false);
        }
    };


    const getStudyPlan = () => {
        const mistakes = userAnswers.filter(a => !a.isCorrect);
        if (mistakes.length === 0) return "عظمة يا بطل! إنت مقفل المحاضرة دي حرفياً. مفيش جزء محتاج تراجعه، إنت جاهز للي بعده! 🚀";

        // Group by topic and collect pageHints
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

    const translateReviewItem = async (index: number) => {
        if (translatedReviewItems[index]) {
            const newItems = { ...translatedReviewItems };
            delete newItems[index];
            setTranslatedReviewItems(newItems);
            return;
        }

        setIsTranslatingItem(index);
        try {
            const item = userAnswers[index];
            const response = await fetch('/api/translate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: JSON.stringify({
                        question: item.question,
                        userAnswer: item.userAnswer || "لم تجب",
                        correctAnswer: item.correctAnswer,
                        explanation: item.explanation
                    }),
                    type: "quiz_item"
                })
            });

            const data = await response.json();
            const cleanReply = (data.result || "").replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanReply);

            setTranslatedReviewItems(prev => ({
                ...prev,
                [index]: parsed
            }));
        } catch (error) {
            console.error("Review translation error:", error);
        } finally {
            setIsTranslatingItem(null);
        }
    };

    if (!lecture) return <div className="min-h-screen bg-[#080810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

    if (isQuizFinished) {
        const score = userAnswers.filter(a => a.isCorrect).length;
        const percentage = Math.round((score / activeQuiz.length) * 100);

        return (
            <main className="min-h-screen bg-[#080810] text-white p-6 md:p-12 overflow-x-hidden" dir="rtl">
                <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <header className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm mb-6">
                            <span>{subjectId}</span>
                            <span>/</span>
                            <span>{lectureId}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black sub-glow-heading">النتيجة النهائية 🏆</h1>
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center">
                                <div className="text-5xl font-black text-amber-500 mb-2">{score}/{activeQuiz.length}</div>
                                <div className="text-white/30 text-xs font-bold uppercase tracking-widest">SCORE</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-black text-cyan-500 mb-2">{percentage}%</div>
                                <div className="text-white/30 text-xs font-bold uppercase tracking-widest">ACCURACY</div>
                            </div>
                        </div>
                    </header>

                    {/* الزتونة Recommendation */}
                    <section className="friendly-card p-8 md:p-12 border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">🫒</div>
                            <h2 className="text-2xl font-black text-amber-500">زتونة المراجعة</h2>
                        </div>
                        <div className="text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-line">
                            {getStudyPlan()}
                        </div>
                    </section>

                    {/* Correction Review */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black mb-8 px-4 border-r-4 border-white/10 pr-4">مراجعة الأسئلة 📝</h2>
                        <div className="space-y-4">
                            {userAnswers.map((item, idx) => (
                                <div key={idx} className={`friendly-card p-6 border-white/5 ${item.isCorrect ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${item.isCorrect ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>{idx + 1}</span>
                                                    <p className="text-lg font-bold text-white/90">
                                                        {translatedReviewItems[idx] ? translatedReviewItems[idx].question : item.question}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => translateReviewItem(idx)}
                                                    disabled={isTranslatingItem === idx}
                                                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${translatedReviewItems[idx] ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                                                >
                                                    {isTranslatingItem === idx ? "جاري..." : translatedReviewItems[idx] ? "عرض الأصل" : "ترجمة"}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <p className="text-white/30 mb-1 font-bold">إجابتك:</p>
                                                    <p className={item.isCorrect || item.type === "essay" ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                                                        {translatedReviewItems[idx] ? translatedReviewItems[idx].userAnswer : (item.userAnswer || "لم تجب")}
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <p className="text-white/30 mb-1 font-bold">{item.type === "essay" ? "الإجابة النموذجية:" : "الإجابة الصحيحة:"}</p>
                                                    <p className="text-green-400 font-bold">
                                                        {translatedReviewItems[idx] ? translatedReviewItems[idx].correctAnswer : item.correctAnswer}
                                                    </p>
                                                </div>
                                            </div>
                                            {item.type === "essay" && (
                                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                                                    <p className="text-amber-500 text-xs font-black uppercase mb-2">💡 ملحوظة الدحيح</p>
                                                    <p className="text-white/70 text-sm italic">قارن إجابتك بالإجابة النموذجية فوق عشان تتأكد إنك غطيت كل النقط. الكتابة بالأسلوب الشخصي ميزة بس المهم المعنى يوصل صح.</p>
                                                </div>
                                            )}
                                            <div className="pt-4 border-t border-white/5">
                                                <p className="text-white/40 text-sm leading-relaxed italic">
                                                    💡 {translatedReviewItems[idx] ? translatedReviewItems[idx].explanation : item.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-center pt-10">
                        <Link href={`/subjects/${subjectId}/${lectureId}`} className="px-12 py-5 rounded-[22px] bg-white/10 hover:bg-white/20 text-white font-black text-lg transition-all active:scale-95 border border-white/10">
                            العودة للمحاضرة
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const currentQ = activeQuiz[currentQuestionIndex];

    return (
        <main className="min-h-screen bg-[#080810] text-white flex flex-col" dir="rtl">
            {/* Minimal Header */}
            <header className="p-6 md:p-10 flex items-center justify-between">
                <Link href={`/subjects/${subjectId}/${lectureId}`} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 border border-white/10 transition-all active:scale-90">✕</Link>
                <div className="flex-1 max-w-md mx-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-amber-500 font-black text-xs uppercase tracking-[0.2em]">{currentQuestionIndex + 1} / {activeQuiz.length}</span>
                        <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{lecture.title}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                            style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className="w-12 h-12"></div>
            </header>

            {/* Quiz Content */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-4xl space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="space-y-4 text-center">
                        <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                            {currentQ.topic}
                        </div>
                        <h2 className="text-lg md:text-2xl font-black text-white leading-[1.3] tracking-tight max-w-3xl mx-auto min-h-[1.5em] flex items-center justify-center">
                            {isTranslatingToEnglish ? (
                                <span className="opacity-50 italic animate-pulse flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                    Translating to English...
                                </span>
                            ) : (
                                showTranslation && translatedQuestion
                                    ? translatedQuestion
                                    : (englishQuestion || (isArabic(currentQ.question) ? "..." : currentQ.question))
                            )}
                        </h2>


                        {/* Translation Button */}
                        <div className="flex flex-col items-center gap-4 pt-4">
                            <button
                                onClick={translateQuestion}
                                disabled={isTranslating}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all border ${showTranslation ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                            >
                                {isTranslating ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span className="text-base">🌍</span>
                                )}
                                <span className="font-bold text-xs uppercase tracking-tighter">
                                    {showTranslation ? "عرض بالإنجليزي" : "ترجمة (عربي)"}
                                </span>

                            </button>

                            {translationError && (
                                <div className="p-4 rounded-2xl border text-sm font-black animate-in fade-in slide-in-from-top-2 duration-300 max-w-2xl bg-red-500/10 border-red-500/20 text-red-200">
                                    ❌ {translationError}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {currentQ.type === "mcq" && currentQ.options && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                {currentQ.options.map((option: string, idx: number) => (
                                    <button
                                        key={option}
                                        onClick={() => setSelectedAnswer(option)}
                                        className={`p-3 md:p-4 rounded-2xl text-right border-2 transition-all duration-300 shadow-xl flex flex-col justify-center min-h-[70px] ${selectedAnswer === option
                                            ? 'bg-amber-500 border-amber-500 text-black scale-[1.02] shadow-amber-500/20'
                                            : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        <span className="text-xs md:text-sm font-black leading-[1.1]">
                                            {isTranslatingToEnglish
                                                ? "..."
                                                : (showTranslation && translatedOptions && translatedOptions[idx]
                                                    ? translatedOptions[idx]
                                                    : (englishOptions && englishOptions[idx] ? englishOptions[idx] : option))}
                                        </span>


                                    </button>
                                ))}
                            </div>
                        )}

                        {currentQ.type === "tf" && (
                            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                                {['true', 'false'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setSelectedAnswer(option)}
                                        className={`p-6 md:p-10 rounded-[32px] text-center border-2 transition-all duration-300 shadow-xl ${selectedAnswer === option
                                            ? 'bg-amber-500 border-amber-500 text-black scale-[1.02] shadow-amber-500/20'
                                            : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        <span className="text-xl md:text-2xl font-black uppercase tracking-widest">
                                            {showTranslation ? (option === 'true' ? 'صح' : 'خطأ') : option}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentQ.type === "fitb" && (
                            <div className="max-w-xl mx-auto">
                                <input
                                    type="text"
                                    value={selectedAnswer || ""}
                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                    placeholder={showTranslation ? "اكتب إجابتك هنا..." : "Type your answer here..."}
                                    className="w-full p-4 md:p-6 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-amber-500 outline-none text-center text-xl font-bold transition-all"
                                />
                            </div>
                        )}

                        {currentQ.type === "essay" && (
                            <div className="max-w-2xl mx-auto space-y-4">
                                <textarea
                                    value={selectedAnswer || ""}
                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                    placeholder={showTranslation ? "اكتب شرحك هنا..." : "Write your explanation here..."}
                                    rows={4}
                                    className="w-full p-4 md:p-6 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-amber-500 outline-none text-right text-lg font-medium transition-all"
                                />
                                <p className="text-xs text-white/40 text-center italic">
                                    {showTranslation
                                        ? "في الأسئلة المقالية، هدفنا نراجع فهمك. قارن إجابتك بنموذج الإجابة بعد ما تدوس 'التالي'."
                                        : "For essay questions, compare your answer with the model answer after clicking 'Next'."}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            disabled={!selectedAnswer}
                            onClick={handleNext}
                            className={`px-12 py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl ${selectedAnswer
                                ? 'bg-white text-black hover:bg-white/90 shadow-white/10'
                                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            {currentQuestionIndex === activeQuiz.length - 1 ? 'إنهاء التحدي 🏁' : 'السؤال التالي ➡️'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .sub-glow-heading {
                    background: linear-gradient(135deg, #fff 0%, #aaa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 30px rgba(255,255,255,0.1));
                }
                .friendly-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 40px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
            `}</style>
        </main>
    );
}
