"use client";

import { useState, useEffect, useRef } from "react";

// ─── Formatting helper ───────────────────────────────────────────────────────
function renderFormattedText(text: string) {
    // 1. Sanitize any real HTML chars first
    const safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 2. Apply inline styles
    const styled = safe
        // ==هايلايتر أصفر==
        .replace(/==([^=\n]+)==/g,
            `<mark style="background:linear-gradient(120deg,#fde047,#f59e0b);color:#111;padding:2px 9px;border-radius:7px;font-weight:800;margin:0 3px;display:inline-block;box-shadow:0 3px 10px rgba(245,158,11,0.45)">$1</mark>`)
        // **مصطلح تقني بلون**
        .replace(/\*\*([^*\n]+)\*\*/g,
            `<strong style="font-weight:900;color:#2dd4bf;text-shadow:0 0 18px rgba(45,212,191,0.6);background:rgba(45,212,191,0.1);padding:2px 8px;border-radius:6px;border-bottom:2px solid rgba(45,212,191,0.5)">$1</strong>`);

    return <span dir="auto" className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: styled }} />;
}
// ─────────────────────────────────────────────────────────────────────────────

interface Message {
    role: "user" | "assistant";
    content: string;
    image?: string;
    file?: {
        name: string;
        type: string;
        url: string;
    };
}

interface ChatBeebaProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatBeeba({ isOpen, onClose }: ChatBeebaProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "أهلاً يا بطل! أنا الدحيح، معاك وعارف كل شبر في المنهج. محتاج تسأل عن إيه النهاردة؟" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedFileObject, setSelectedFileObject] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFileObject(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedFile(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const clipboardItems = e.clipboardData?.items;
        if (!clipboardItems) return;

        Array.from(clipboardItems).forEach(item => {
            if (item.type.indexOf('image/') === 0) {
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                        setSelectedFile(readerEvent.target?.result as string);
                        setSelectedFileObject(file);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setSelectedFileObject(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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
                        mimeType: 'audio/webm'
                    };

                    // Auto-send immediately after recording stops
                    handleSend(input, voiceAttachment);
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

    const handleSend = async (textOverride?: string, voiceAttachment?: { data: string; mimeType: string }) => {
        const textToSend = typeof textOverride === 'string' ? textOverride : input;

        if ((!textToSend.trim() && !selectedFile && !voiceAttachment) || isLoading) return;

        const userMessage = textToSend.trim() || (voiceAttachment ? "أرسل تسجيلاً صوتياً" : (selectedFileObject?.type.includes('pdf') ? "أرسل ملف PDF" : "أرسل صورة"));
        const currentFileContent = selectedFile;
        const currentFileObject = selectedFileObject;

        setInput("");
        removeSelectedFile();

        const newMessage: Message = { role: "user", content: userMessage };
        if (currentFileContent && currentFileObject) {
            if (currentFileObject.type.startsWith('image/')) {
                newMessage.image = currentFileContent;
            } else if (currentFileObject.type === 'application/pdf') {
                newMessage.file = {
                    name: currentFileObject.name,
                    type: currentFileObject.type,
                    url: currentFileContent
                };
            }
        }

        setMessages((prev) => [...prev, newMessage]);
        playSound(sendSoundUrl);
        setIsLoading(true);

        try {
            // Prepare payload
            const payload: any = { message: userMessage, history: messages };

            if (currentFileContent && currentFileObject) {
                // Extract base64 without the data URL prefix
                const base64Data = currentFileContent.split(',')[1];
                payload.attachments = [
                    {
                        data: base64Data,
                        mimeType: currentFileObject.type
                    }
                ];
            }

            if (voiceAttachment) {
                if (!payload.attachments) payload.attachments = [];
                payload.attachments.push(voiceAttachment);
            }

            const response = await fetch("/api/chat-beeba", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.reply) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
                playSound(receiveSoundUrl);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "معلش يا صاحبي حصل مشكلة، جرب تاني كمان شوية." }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "معلش يا صاحبي حصل مشكلة، جرب تاني كمان شوية." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 15% 15%, #0a0118 0%, #04040e 45%, #000c0c 100%)' }}>
            {/* Multi-color animated orbs */}
            <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: '55%', height: '55%', background: 'radial-gradient(circle,rgba(45,212,191,0.22) 0%,transparent 65%)', filter: 'blur(90px)', borderRadius: '50%', animation: 'float 14s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.18) 0%,transparent 65%)', filter: 'blur(90px)', borderRadius: '50%', animation: 'float-delayed 17s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '30%', right: '5%', width: '35%', height: '35%', background: 'radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 65%)', filter: 'blur(70px)', borderRadius: '50%', animation: 'float 10s ease-in-out infinite reverse' }} />
            <div style={{ position: 'absolute', bottom: '25%', left: '3%', width: '28%', height: '28%', background: 'radial-gradient(circle,rgba(251,191,36,0.09) 0%,transparent 65%)', filter: 'blur(60px)', borderRadius: '50%', animation: 'float-delayed 12s ease-in-out infinite' }} />

            <div
                className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full relative z-10 overflow-hidden h-full"
                dir="rtl"
            >
                {/* Header */}
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#2dd4bf 0%,#7c3aed 50%,#ec4899 100%)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(45,212,191,0.5)', animation: 'bounce-slow 4s ease-in-out infinite' }}>
                                <span style={{ fontSize: 24 }}>🤖</span>
                            </div>
                            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, background: '#22c55e', borderRadius: '50%', border: '2px solid #04040e', boxShadow: '0 0 8px rgba(34,197,94,0.9)' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 'clamp(1.1rem,3vw,1.7rem)', fontWeight: 900, background: 'linear-gradient(90deg,#2dd4bf,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-0.01em' }}>
                                الدحيح 🎓
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <div style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 6px #22c55e', animation: 'pulse 2s infinite' }} />
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.35em', fontWeight: 700 }}>AI CURRICULUM SPECIALIST</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="active:scale-90 hover:bg-white/10 transition-all"
                        style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-hide" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-end gap-3 animate-in slide-in-from-bottom-4 duration-500 ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                        >
                            {/* AI avatar */}
                            {msg.role === "assistant" && (
                                <div style={{ width: 42, height: 42, minWidth: 42, background: 'linear-gradient(135deg,#2dd4bf,#7c3aed)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, boxShadow: '0 4px 18px rgba(124,58,237,0.5)', alignSelf: 'flex-end' }}>
                                    🤖
                                </div>
                            )}

                            {/* Message bubble */}
                            <div style={msg.role === "user" ? {
                                maxWidth: '80%',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '20px 4px 20px 20px',
                                background: 'linear-gradient(135deg,rgba(45,212,191,0.18) 0%,rgba(124,58,237,0.12) 100%)',
                                border: '1px solid rgba(45,212,191,0.25)',
                                color: 'white',
                                fontSize: 'clamp(0.9rem,1.3vw,1rem)',
                                lineHeight: 1.75,
                                boxShadow: '0 4px 20px rgba(45,212,191,0.12)',
                            } : {
                                maxWidth: '82%',
                                padding: '1rem 1.3rem',
                                borderRadius: '4px 20px 20px 20px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRight: '3px solid rgba(124,58,237,0.7)',
                                color: 'rgba(255,255,255,0.92)',
                                fontSize: 'clamp(0.9rem,1.3vw,1rem)',
                                lineHeight: 1.85,
                                backdropFilter: 'blur(14px)',
                                boxShadow: '0 6px 30px rgba(0,0,0,0.4)',
                            }}>
                                <div className="space-y-2">
                                    {msg.image && (
                                        <div className="relative rounded-xl overflow-hidden border border-white/10 mt-1 max-w-xs">
                                            <img src={msg.image} alt="Uploaded attachment" className="w-full h-auto object-contain" />
                                        </div>
                                    )}
                                    {msg.file && msg.file.type === 'application/pdf' && (
                                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl mt-1 max-w-xs overflow-hidden">
                                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{msg.file.name}</p>
                                                <p className="text-white/40 text-xs uppercase tracking-tighter">PDF Document</p>
                                            </div>
                                        </div>
                                    )}
                                    {msg.content && (
                                        <div className="space-y-1">
                                            {msg.content.split(/(```[\w]*\n[\s\S]*?```)/g).map((segment, i) => {
                                                if (segment.startsWith('```')) {
                                                    const code = segment.replace(/^```\w*\n?/, '').replace(/```$/, '');
                                                    return (
                                                        <pre key={i} dir="ltr" style={{ background: 'rgba(0,0,0,0.55)', padding: '0.9rem 1rem', borderRadius: 14, margin: '0.6rem 0', overflowX: 'auto', fontSize: '0.82rem', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.88)', direction: 'ltr', textAlign: 'left' }}>
                                                            <code>{code}</code>
                                                        </pre>
                                                    );
                                                }
                                                return <div key={i}>{renderFormattedText(segment)}</div>;
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User avatar */}
                            {msg.role === "user" && (
                                <div style={{ width: 42, height: 42, minWidth: 42, background: 'linear-gradient(135deg,rgba(45,212,191,0.25),rgba(45,212,191,0.08))', border: '1px solid rgba(45,212,191,0.3)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, alignSelf: 'flex-end' }}>
                                    👤
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-end gap-3 justify-end animate-in fade-in duration-300">
                            <div style={{ width: 42, height: 42, minWidth: 42, background: 'linear-gradient(135deg,#2dd4bf,#7c3aed)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                🤖
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRight: '3px solid rgba(124,58,237,0.7)', borderRadius: '4px 20px 20px 20px', padding: '0.85rem 1.25rem', backdropFilter: 'blur(14px)', display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div className="w-3 h-3 rounded-full animate-bounce" style={{ background: '#2dd4bf' }} />
                                <div className="w-3 h-3 rounded-full animate-bounce" style={{ background: '#a78bfa', animationDelay: '0.15s' }} />
                                <div className="w-3 h-3 rounded-full animate-bounce" style={{ background: '#f472b6', animationDelay: '0.3s' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-14" />
                </div>

                {/* Input Dock */}
                <div className="px-6 md:px-20 pb-10 md:pb-16 flex flex-col items-center">

                    {/* File Preview Area */}
                    {selectedFile && selectedFileObject && (
                        <div className="w-full max-w-6xl mb-4 ml-auto">
                            <div className="inline-block relative bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-xl animate-in zoom-in duration-300">
                                {selectedFileObject.type.startsWith('image/') ? (
                                    <img src={selectedFile} alt="Preview" className="h-24 w-auto rounded-xl object-contain bg-black/20" />
                                ) : (
                                    <div className="h-24 px-6 flex flex-col items-center justify-center bg-black/20 rounded-xl">
                                        <svg className="w-10 h-10 text-red-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-white/60 text-[10px] max-w-[120px] truncate">{selectedFileObject.name}</p>
                                    </div>
                                )}
                                <button
                                    onClick={removeSelectedFile}
                                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 z-10"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="w-full max-w-6xl">
                        <div className="relative group p-[2px] rounded-[2rem] bg-gradient-to-r from-white/10 via-white/5 to-white/10 focus-within:from-primary/40 focus-within:via-secondary/40 focus-within:to-primary/40 transition-all duration-700 shadow-2xl">
                            <div className="flex flex-col md:flex-row gap-4 bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[1.9rem] p-4 md:p-6">

                                {/* Upload & Record Buttons */}
                                <div className="flex items-center gap-2 items-end pb-1 pr-2">
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-4 bg-white/5 hover:bg-white/15 rounded-2xl transition-all text-white/50 hover:text-white border border-transparent hover:border-white/10 group active:scale-95"
                                        title="إرفاق ملف أو صورة"
                                    >
                                        <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex-1 relative">
                                    <textarea
                                        rows={1}
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        onPaste={handlePaste}
                                        placeholder={isRecording ? "جاري التسجيل..." : "حابب تسأل الدحيح عن إيه في المنهج يا بطل؟"}
                                        className="w-full bg-transparent border-none px-4 py-4 md:py-6 text-xl md:text-3xl text-white placeholder:text-white/20 focus:outline-none transition-all resize-none max-h-[200px] scrollbar-hide"
                                    />
                                </div>
                                <div className="flex items-end justify-end">
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={isLoading || (!input.trim() && !selectedFile)}
                                        className="h-16 md:h-20 px-10 md:px-16 bg-gradient-to-r from-primary to-secondary text-black font-black text-2xl md:text-3xl rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group"
                                    >
                                        <span>إرسال</span>
                                        <svg className="w-8 h-8 transition-transform group-hover:translate-x-[-4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                            <p className="text-white/10 text-[10px] md:text-xs uppercase tracking-[0.6em] font-black order-2 md:order-1 text-center md:text-left">AZ-ZAITOUNA INTELLIGENT WORKSPACE • ALPHA 1.0</p>
                            <div className="flex items-center gap-4 order-1 md:order-2">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] md:text-[10px] text-white/40 font-black border border-white/5 uppercase tracking-widest">Shift + Enter for new line</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
