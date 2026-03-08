"use client";

import React, { useState, useEffect, useRef } from "react";

interface Scene {
    title: string;
    narration: string;
    visual_cue: string;
    duration_hint: number;
}

interface AIVideoExplainerProps {
    script: Scene[];
}

const AIVideoExplainer: React.FC<AIVideoExplainerProps> = ({ script }) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isMuted, setIsMuted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const scriptContainerRef = useRef<HTMLDivElement>(null);

    const activeScene = script[currentSceneIndex];

    // --- Voice Logic (TTS) ---
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (isPlaying && !isMuted) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(activeScene.narration);

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.includes('ar-EG')) ||
                voices.find(v => v.lang.startsWith('ar')) ||
                voices[0];

            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.lang = 'ar';
            utterance.rate = 1.0;

            utterance.onend = () => {
                if (currentSceneIndex < script.length - 1) {
                    setTimeout(() => setCurrentSceneIndex(prev => prev + 1), 1000);
                } else {
                    setIsPlaying(false);
                }
            };

            speechRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        } else {
            window.speechSynthesis.cancel();
        }

        return () => window.speechSynthesis.cancel();
    }, [currentSceneIndex, isPlaying, isMuted, activeScene.narration, script.length]);

    // --- Typing & Auto-Scroll Logic ---
    useEffect(() => {
        if (!isPlaying) return;

        let i = 0;
        setDisplayedText("");
        const timer = setInterval(() => {
            if (i < activeScene.narration.length) {
                setDisplayedText((prev) => prev + activeScene.narration.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);

        // Auto-scroll the script sidebar to the active scene
        const activeScriptItem = document.getElementById(`script-scene-${currentSceneIndex}`);
        if (activeScriptItem && scriptContainerRef.current) {
            scriptContainerRef.current.scrollTo({
                top: activeScriptItem.offsetTop - 100,
                behavior: 'smooth'
            });
        }

        return () => clearInterval(timer);
    }, [currentSceneIndex, isPlaying, activeScene.narration]);

    // --- Progress Simulation ---
    useEffect(() => {
        if (!isPlaying) {
            setProgress(0);
            return;
        }

        const duration = (activeScene.duration_hint || 10) * 1000;
        const start = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - start;
            const nextProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(nextProgress);

            if (nextProgress < 100 && isPlaying) {
                requestAnimationFrame(updateProgress);
            }
        };

        const raf = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(raf);
    }, [currentSceneIndex, isPlaying, activeScene.duration_hint]);

    const handleJumpToScene = (index: number) => {
        setCurrentSceneIndex(index);
        setIsPlaying(true);
    };

    return (
        <div ref={containerRef} className="relative w-full bg-[#050508] rounded-[40px] overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in duration-1000">

            {/* ─── Cinema 3-Column Layout ─── */}
            <div className="flex flex-col lg:flex-row h-full min-h-[600px]">

                {/* [1] Sidebar: Timeline (Chapters) */}
                <div className="w-full lg:w-[280px] bg-black/40 border-r border-white/5 p-6 overflow-y-auto hidden md:block">
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Lecture Timeline</h3>
                        <p className="text-white/40 text-xs font-bold leading-tight">Follow the flow of the lecture chapters.</p>
                    </div>
                    <div className="space-y-3">
                        {script.map((scene, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleJumpToScene(idx)}
                                className={`w-full group text-right p-4 rounded-2xl border transition-all duration-300 ${idx === currentSceneIndex
                                        ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/5'
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3 justify-end mb-1">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${idx === currentSceneIndex ? 'text-primary' : 'text-white/20'}`}>
                                        Scene {idx + 1}
                                    </span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${idx === currentSceneIndex ? 'bg-primary animate-pulse' : 'bg-white/10'}`} />
                                </div>
                                <p className={`text-xs font-bold transition-colors ${idx === currentSceneIndex ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                                    {scene.title}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* [2] Main Player: The Experience */}
                <div className="flex-1 relative bg-black flex flex-col">
                    {/* Stage */}
                    <div className="flex-1 relative overflow-hidden group/stage">
                        <div key={currentSceneIndex} className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#08080c] via-[#0c0c1a] to-[#151525] animate-ken-burns">
                            {/* Visual Background */}
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                            </div>

                            {/* Main Visual Aid */}
                            <div className="relative z-10 text-[180px] md:text-[240px] drop-shadow-[0_0_60px_rgba(0,242,255,0.5)] transform hover:scale-110 transition-transform duration-1000">
                                {activeScene.visual_cue.includes('emoji') || activeScene.visual_cue.length < 10 ? activeScene.visual_cue.split(':')[1]?.trim() || '📽️' : '🎓'}
                            </div>
                        </div>

                        {/* Floating AI Teacher Avatar */}
                        <div className={`absolute bottom-32 right-10 z-30 transition-all duration-1000 transform ${isPlaying ? 'scale-105 opacity-100' : 'scale-90 opacity-60'}`}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full animate-pulse" />
                                <div className="w-40 h-40 rounded-[48px] border-2 border-white/10 overflow-hidden shadow-2xl bg-black/60 backdrop-blur-3xl flex items-center justify-center">
                                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#00f2ff" />
                                                <stop offset="100%" stopColor="#bd65ff" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#aiGrad)" strokeWidth="0.5" strokeDasharray="4 8" className="animate-spin-slow" />
                                        <path d="M50 20 L80 40 L80 70 L50 90 L20 70 L20 40 Z" fill="none" stroke="url(#aiGrad)" strokeWidth="2" opacity="0.4" />
                                        <circle cx="50" cy="50" r="15" fill="url(#aiGrad)" className={isPlaying ? "animate-pulse" : ""} />
                                        {isPlaying && (
                                            <g className="animate-ping" style={{ animationDuration: '3s' }}>
                                                <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="0.5" opacity="0.2" />
                                            </g>
                                        )}
                                    </svg>
                                </div>
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 glass-pill px-4 py-1.5 flex items-center gap-2 border-primary/20 bg-black/80">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">AI Educator</span>
                                </div>
                            </div>
                        </div>

                        {/* Controls (Floating Top) */}
                        <div className="absolute top-10 inset-x-10 flex justify-between items-center z-40 pointer-events-none">
                            <div className="flex items-center gap-4 pointer-events-auto">
                                <button onClick={() => setIsMuted(!isMuted)} className="p-4 rounded-2xl glass-pill border-white/5 hover:border-white/20 transition-all text-white shadow-xl">
                                    {isMuted ? '🔇' : '🔊'}
                                </button>
                            </div>
                            <div className="glass-pill px-6 py-3 border-white/5 shadow-2xl pointer-events-auto">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">Active Scene</p>
                                <h4 className="text-sm font-bold text-white tracking-wide">{activeScene.title}</h4>
                            </div>
                        </div>

                        {/* Progress Bar (Bottom Edge) */}
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/5 z-50 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-shimmer transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Subtitles Area (Darkened Bottom) */}
                    <div className="h-[120px] bg-[#020205] border-t border-white/5 p-8 flex items-center justify-center">
                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed text-center opacity-90">
                                {displayedText}
                                {isPlaying && <span className="inline-block w-2 h-6 bg-primary ml-2 animate-pulse rounded-full" />}
                            </p>
                        </div>
                    </div>
                </div>

                {/* [3] Sidebar: Full Script (Interactive) */}
                <div className="w-full lg:w-[320px] bg-black/60 border-l border-white/5 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Full Transcript</h3>
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Real-time</span>
                        </div>
                        <p className="text-white/40 text-xs font-bold">Follow along with the auto-scrolling script.</p>
                    </div>
                    <div ref={scriptContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {script.map((scene, idx) => (
                            <div
                                key={idx}
                                id={`script-scene-${idx}`}
                                className={`transition-all duration-700 ${idx === currentSceneIndex ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${idx === currentSceneIndex ? 'bg-primary text-black' : 'bg-white/5 text-white/40'}`}>
                                        Scene {idx + 1}
                                    </span>
                                </div>
                                <p className={`text-sm md:text-base leading-relaxed text-right ${idx === currentSceneIndex ? 'font-bold text-white' : 'text-white/40'}`}>
                                    {scene.narration}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Immersive Overlay (Start Experience) */}
            {!isPlaying && (
                <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[#050508]/80 backdrop-blur-xl transition-all duration-1000">
                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-150 animate-pulse" />
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="group/btn w-36 h-36 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 hover:border-primary/40 transition-all duration-700"
                        >
                            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-black pl-2 shadow-[0_0_60px_rgba(0,242,255,0.4)] transition-transform group-hover/btn:scale-105">
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase italic">NoteGPT Immersive</h2>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-[0.5em]">ابدأ تجربة الشرح الذكي — صوت وصورة بالكامل</p>
                    </div>

                    {/* Feature badges */}
                    <div className="absolute bottom-12 flex gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Arabic Narrator</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Cinema View</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Interactive Script</span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes ken-burns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.15) rotate(0.5deg); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                }
                .animate-ken-burns {
                    animation: ken-burns 15s ease-in-out infinite alternate;
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite linear;
                }
                .animate-spin-slow {
                    animation: spin-slow 30s infinite linear;
                }
                .glass-pill {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default AIVideoExplainer;
