"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp?: number;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    lastUpdated: number;
}

export default function BeebaChatPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [attachments, setAttachments] = useState<{ data: string; mimeType: string; preview: string }[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const savedSessions = localStorage.getItem("dahhih_sessions");
        let initialSessions: ChatSession[] = [];

        if (savedSessions) {
            initialSessions = JSON.parse(savedSessions);
        }

        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: "محادثة جديدة",
            messages: [{ role: "assistant", content: "أهلاً يا زميلي! أنا الدحيح، معاك وعاصر المنهج عاصر. محتاج تفهم إيه النهاردة؟", timestamp: Date.now() }],
            lastUpdated: Date.now()
        };

        setSessions([newSession, ...initialSessions]);
        setActiveSessionId(newId);
        setMessages(newSession.messages);
    }, []);

    // Save sessions whenever they change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem("dahhih_sessions", JSON.stringify(sessions));
        }
    }, [sessions]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 500);
        return () => clearTimeout(timer);
    }, [messages]);

    const createNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: "محادثة جديدة",
            messages: [{ role: "assistant", content: "أهلاً يا زميلي! أنا الدحيح، معاك وعاصر المنهج عاصر. محتاج تفهم إيه النهاردة؟", timestamp: Date.now() }],
            lastUpdated: Date.now()
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newId);
        setMessages(newSession.messages);
    };

    const switchSession = (id: string) => {
        const session = sessions.find(s => s.id === id);
        if (session) {
            setActiveSessionId(id);
            setMessages(session.messages);
        }
    };

    const deleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = sessions.filter(s => s.id !== id);
        setSessions(updated);
        if (activeSessionId === id) {
            if (updated.length > 0) {
                switchSession(updated[0].id);
            } else {
                createNewChat();
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const base64 = readerEvent.target?.result as string;
                const data = base64.split(",")[1];
                setAttachments(prev => [...prev, {
                    data,
                    mimeType: file.type,
                    preview: URL.createObjectURL(file)
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = (e.target?.result as string).split(",")[1];
                    const voiceAttachment = {
                        data: base64,
                        mimeType: 'audio/webm',
                        preview: 'voice_recording'
                    };

                    // Auto-send immediately after recording stops
                    sendMessage(input, [...attachments, voiceAttachment]);
                };
                reader.readAsDataURL(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Recording error:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Sound effects (Base64)
    // Send sound: a short, high-pitched "pop"
    const sendSoundUrl = "data:audio/wav;base64,UklGRmACAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YToBAAABAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAACQAKAAgACAAGAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAYQBiAGMAZABlAGYAZwBoAGkAagBrAGwAbQBuAG8AcABxAHIAcwB0AHUAdgB3AHgAeQB6AHsAfAB9AH4AfwCAAIEAggCDAIQAhQCGAIcAiACJAIoAiwCMAI0AjgCPAJAAkQCSAJMAlACVAJYAlwCYAJkAmgCbAJwAnQCeAJ8AoAChAKIAowCkAKUApgCnAKgAqQCqAKsArACtAK4ArwCwALEAsgCzALQAtQC2ALcAuAC5ALoAuwC8AL0AvgC/AMAAwQDCAMMAxADFANYA1wDYANkA2gDbANwA3QDeAN8A4ADhAOIA4wDkAOUA5gDnAOgA6QDqAOsA7ADtAO4A7wDwAPE";
    // Receive sound: a softer, double "bloop"
    const receiveSoundUrl = "data:audio/wav;base64,UklGRmQCAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YUACAAABAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAACQAKAAgACAAGAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAYQBiAGMAZABlAGYAZwBoAGkAagBrAGwAbQBuAG8AcABxAHIAcwB0AHUAdgB3AHgAeQB6AHsAfAB9AH4AfwCAAIEAggCDAIQAhQCGAIcAiACJAIoAiwCMAI0AjgCPAJAAkQCSAJMAlACVAJYAlwCYAJkAmgCbAJwAnQCeAJ8AoAChAKIAowCkAKUApgCnAKgAqQCqAKsArACtAK4ArwCwALEAsgCzALQAtQC2ALcAuAC5ALoAuwC8AL0AvgC/AMAAwQDCAMMAxADFANYA1wDYANkA2gDbANwA3QDeAN8A4ADhAOIA4wDkAOUA5gDnAOgA6QDqAOsA7ADtAO4A7wDwAPEA8gDzAPQA9QD2APcA+AD5APoA+wD8AP0A/gD/AA==";

    const playSound = (url: string) => {
        try {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed silently', e));
        } catch (e) {
            console.error('Audio not supported or failed to create');
        }
    };

    const handleSend = async () => {
        sendMessage(input, attachments);
    };

    const sendMessage = async (textToSend: string, attachmentsToSend: { data: string; mimeType: string; preview: string }[]) => {
        if ((!textToSend.trim() && attachmentsToSend.length === 0) || isLoading) return;

        const userMessage = textToSend.trim();
        const currentAttachments = [...attachmentsToSend];

        // Optimistic update
        const newUserMessage: Message = {
            role: "user",
            content: userMessage || "أرسل ملفاً",
            timestamp: Date.now(),
            image: currentAttachments.find(a => a.mimeType.startsWith('image/'))?.preview
        } as Message & { image?: string };
        const updatedMessages = [...messages, newUserMessage];

        setMessages(updatedMessages);
        playSound(sendSoundUrl);
        setIsLoading(true);
        setInput("");
        setAttachments([]);

        // Update session title if it's the first real message
        let currentTitle = sessions.find(s => s.id === activeSessionId)?.title || "محادثة جديدة";
        if (messages.length <= 1) {
            currentTitle = userMessage ? (userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage) : "محادثة وسائط";
        }

        try {
            const response = await fetch("/api/chat-beeba", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages,
                    attachments: currentAttachments.map(a => ({ data: a.data, mimeType: a.mimeType }))
                }),
            });

            const data = await response.json();
            let finalMessages = updatedMessages;

            if (data.reply) {
                const assistantMessage: Message = { role: "assistant", content: data.reply, timestamp: Date.now() };
                finalMessages = [...updatedMessages, assistantMessage];
                setMessages(finalMessages);
                playSound(receiveSoundUrl);
            } else {
                throw new Error(data.error || "حصلت مشكلة في الرد");
            }

            // Sync with sessions
            setSessions(prev => prev.map(s => s.id === activeSessionId ? {
                ...s,
                messages: finalMessages,
                title: currentTitle,
                lastUpdated: Date.now()
            } : s));

        } catch (error: any) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: `يا زميلي، السيرفر مهنج أو فيه مشكلة في الرفع. جرب ترفع صورة أصغر أو تتأكد من النت. (Error: ${error.message})`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);

            if (!input) setInput(userMessage);
            if (attachments.length === 0) setAttachments(currentAttachments);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    return (
        <div className="min-h-screen flex bg-background relative overflow-hidden text-white font-sans" dir="rtl">
            {/* Aesthetic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-500"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 right-0 h-full ${isSidebarOpen ? 'w-[320px] shadow-[0_0_50px_rgba(0,0,0,0.8)]' : 'w-0'} bg-[#0a0a0a]/95 backdrop-blur-3xl border-l border-white/5 transition-all duration-500 flex flex-col z-40 overflow-hidden`}>
                <div className="p-6 border-b border-white/5 flex flex-col gap-4">
                    <button
                        onClick={createNewChat}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 hover:border-primary/30 transition-all font-black text-sm uppercase tracking-widest text-primary shadow-lg shadow-primary/5 group"
                    >
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        محادثة جديدة
                    </button>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] mr-2">المحادثات السابقة</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {sessions.map(s => (
                        <div
                            key={s.id}
                            onClick={() => switchSession(s.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border group relative ${activeSessionId === s.id ? 'bg-primary/10 border-primary/20 text-white' : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/70'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">💬</span>
                                <span className="flex-1 truncate font-bold text-sm">{s.title}</span>
                                <button
                                    onClick={(e) => deleteSession(e, s.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <svg className="w-4 h-4 text-white/30 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen bg-[#050505]">
                {/* Header - Now in flex flow to avoid overlapping content */}
                <header className="flex-none h-20 md:h-24 flex justify-between items-center bg-black/80 backdrop-blur-3xl px-6 md:px-12 border-b border-white/10 z-50">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                                <span className="text-xl md:text-3xl">🎓</span>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-gradient tracking-tight">{sessions.find(s => s.id === activeSessionId)?.title || "الدحيح"}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md">الرئيسية</Link>
                    </div>
                </header>

                {/* Messages Container */}
                <main className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
                    <div className="max-w-4xl w-full mx-auto px-4 md:px-8 pt-6 pb-12 space-y-6">
                        {messages.map((msg, idx) => {
                            const linkMatch = msg.content.match(/LINK:\s*(.+)$/m);
                            const cleanContent = linkMatch ? msg.content.replace(/LINK:\s*.+$/m, '').trim() : msg.content;
                            const sourceLink = linkMatch ? linkMatch[1].trim() : null;

                            return (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} animate-in slide-in-from-bottom-4 duration-500`}
                                >
                                    <div
                                        className={`max-w-[85%] md:max-w-[70%] p-4 md:p-6 rounded-3xl text-base md:text-xl leading-[1.6] shadow-xl relative group ${msg.role === "user"
                                            ? "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-white rounded-tr-none"
                                            : "bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white/95 rounded-tl-none backdrop-blur-2xl"
                                            }`}
                                    >
                                        <div className="relative z-10 whitespace-pre-wrap">
                                            {/* Render Image if exists */}
                                            {(msg as any).image && (
                                                <div className="mb-4 relative rounded-2xl overflow-hidden border border-white/10 max-w-sm">
                                                    <img src={(msg as any).image} alt="Uploaded attachment" className="w-full h-auto object-contain" />
                                                </div>
                                            )}

                                            {cleanContent}
                                        </div>

                                        {sourceLink && (
                                            <div className="mt-4 flex justify-start items-center pt-4 border-t border-white/5 border-dashed">
                                                <Link
                                                    href={sourceLink}
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-sm text-primary transition-all group/link"
                                                >
                                                    <svg className="w-4 h-4 rotate-45 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                    <span className="font-black">رابط المحاضرة</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="flex justify-end animate-in fade-in duration-300">
                                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl rounded-tl-none flex gap-3 backdrop-blur-3xl">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-16" />
                    </div>
                </main>

                {/* Input Area */}
                <footer className="px-4 md:px-24 pb-6 flex flex-col items-center flex-none">
                    {attachments.length > 0 && (
                        <div className="mb-4 flex gap-3">
                            {attachments.map((att, i) => (
                                <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                                    {att.mimeType.startsWith('image/') ? (
                                        <img src={att.preview} className="w-full h-full object-cover" alt="preview" />
                                    ) : (
                                        <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-xl">🎙️</div>
                                    )}
                                    <button
                                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="w-full max-w-4xl">
                        <div className="relative group p-[1px] rounded-[2rem] bg-gradient-to-r from-white/10 via-white/5 to-white/10 focus-within:from-primary/40 focus-within:to-secondary/40 transition-all duration-700">
                            <div className="flex flex-col md:flex-row gap-3 bg-[#080808]/95 backdrop-blur-3xl rounded-[1.9rem] p-3 md:p-4">
                                <div className="flex items-center gap-2">
                                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" />
                                    <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 border border-white/10 transition-all group/btn">
                                        <svg className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </button>
                                    <button
                                        onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}
                                        className={`p-3 rounded-xl border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <svg className={`w-6 h-6 ${isRecording ? 'text-red-500' : 'text-white/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v10a3 3 0 006 0V3a3 3 0 00-3-3z" /></svg>
                                    </button>
                                </div>

                                <div className="flex-1 relative">
                                    <textarea
                                        rows={1}
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        placeholder={isRecording ? "جاري التسجيل..." : "إسأل الدحيح..."}
                                        className="w-full bg-transparent border-none px-3 py-3 text-lg text-white placeholder:text-white/10 focus:outline-none transition-all resize-none max-h-[120px] scrollbar-hide min-h-[48px]"
                                    />
                                </div>
                                <div className="flex items-end justify-end">
                                    <button
                                        onClick={handleSend}
                                        disabled={isLoading || (!input.trim() && attachments.length === 0)}
                                        className="h-12 md:h-14 px-8 bg-gradient-to-r from-primary to-secondary text-black font-black text-lg rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-10 flex items-center justify-center gap-3"
                                    >
                                        <span>إرسال</span>
                                        <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div >

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .text-gradient {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div >
    );
}
