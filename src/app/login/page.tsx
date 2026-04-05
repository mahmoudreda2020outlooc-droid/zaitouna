"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [studentId, setStudentId] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Enter ID, 2: Confirm Info
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [mode, setMode] = useState<"student" | "admin">("student");
    const router = useRouter();

    useEffect(() => {
        // Redirection is handled by server-side middleware
    }, []);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (mode === "admin") {
            try {
                const response = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ adminKey }),
                });
                if (response.ok) {
                    router.push("/admin/students");
                } else {
                    const data = await response.json();
                    setError(data.message || "كود المسؤول غير صحيح");
                }
            } catch (err) {
                setError("حدث خطأ ما");
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            const response = await fetch(`/api/student-lookup?studentId=${studentId}`);
            const data = await response.json();

            if (response.ok) {
                setStudentInfo(data.student);
                setStep(2);
            } else {
                setError(data.message || "كود الطالب غير صحيح");
            }
        } catch (err) {
            setError("حدث خطأ ما، حاول مرة أخرى");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/");
            } else {
                setError(data.message || "حدث خطأ أثناء تسجيل الدخول");
            }
        } catch (err) {
            setError("حدث خطأ ما، حاول مرة أخرى");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Dynamic Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-secondary/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-primary/5 rounded-full blur-[80px]"></div>

            <div className="fade-in w-full max-w-lg px-6 relative z-10">
                <div className="glass-card p-10 md:p-14 border border-white/5 relative overflow-hidden">
                    {/* Subtle patterns */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

                    <div className="text-center mb-10">
                        <h1 className="text-6xl font-black mb-4 tracking-tighter text-white">الزتـونـة</h1>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6 neon-glow"></div>
                        <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                            نهدف لتيسير المذاكرة ومساعدة زملائنا الطلاب <br />
                            <span className="text-white/20 text-[10px] mt-2 block italic uppercase tracking-widest">Powered by Advanced AI</span>
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleLookup} className="space-y-8">
                            <div className="relative group">
                                <label htmlFor="studentId" className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 mr-1 text-right">
                                    {mode === "student" ? "كود الطالب الشخصي" : "كود المسؤول السري"}
                                </label>
                                <div className="relative">
                                    {mode === "student" ? (
                                        <input
                                            type="text"
                                            id="studentId"
                                            value={studentId}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setStudentId(val);
                                                // Hidden trigger: typing "admin" switches to admin mode
                                                if (val.toLowerCase() === "admin") {
                                                    setMode("admin");
                                                    setStudentId("");
                                                }
                                            }}
                                            className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all text-center text-3xl font-black tracking-[0.2em]"
                                            placeholder="0000000"
                                            required
                                        />
                                    ) : (
                                        <div className="fade-in space-y-4">
                                            <input
                                                type="password"
                                                id="adminKey"
                                                value={adminKey}
                                                autoFocus
                                                onChange={(e) => setAdminKey(e.target.value)}
                                                className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-secondary/40 focus:border-secondary/30 transition-all text-center text-xl font-bold"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMode("student")}
                                                className="w-full text-[10px] text-white/10 uppercase hover:text-white/30 transition-colors"
                                            >
                                                Back to Student Login
                                            </button>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary group-focus-within:w-1/2 transition-all duration-500 opacity-50"></div>
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-400/5 py-3 rounded-xl border border-red-400/10 fade-in">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`btn-premium w-full group relative ${isLoading ? "opacity-90 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? (
                                    <div className="btn-loader"></div>
                                ) : (
                                    <>
                                        <span className="relative z-10">{mode === "student" ? "تحقق من الكود" : "دخول المسؤول"}</span>
                                        <svg className="w-6 h-6 z-10 group-hover:translate-x-[-10px] transition-transform duration-300"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            style={{ filter: 'invert(1)' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-8 fade-in">
                            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl text-center space-y-4">
                                <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold">بيانات الطالب</div>
                                <h2 className="text-2xl font-bold text-white">{studentInfo.name}</h2>
                                <div className="flex justify-center gap-4 text-sm">
                                    <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary">
                                        مجموعة {studentInfo.group}
                                    </div>
                                    <div className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary">
                                        فصل {studentInfo.section} {studentInfo.subGroup}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className={`btn-premium w-full group relative ${isLoading ? "opacity-90 cursor-not-allowed" : ""}`}
                                >
                                    {isLoading ? (
                                        <div className="btn-loader"></div>
                                    ) : (
                                        <span className="relative z-10">تأكيد الدخول</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-white/30 text-sm font-bold hover:text-white/50 transition-colors py-2"
                                >
                                    تغيير الكود
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-14 pt-8 border-t border-white/5 text-center flex flex-col gap-4">
                        <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
                            Developed for the next generation of engineers
                        </p>
                        <div className="text-white/10 text-xs">
                            © {new Date().getFullYear()} Az-Zaitouna LMS
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-8 flex justify-center gap-8 text-white/20 text-xs uppercase tracking-widest font-bold">
                    <span className="hover:text-primary/40 cursor-pointer transition-colors">Privacy</span>
                    <span className="hover:text-primary/40 cursor-pointer transition-colors">Support</span>
                    <span className="hover:text-primary/40 cursor-pointer transition-colors">LMS Sync</span>
                </div>
            </div>
        </div>
    );
}
