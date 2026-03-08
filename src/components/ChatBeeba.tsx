"use client";

import { useState, useEffect, useRef } from "react";
import { tts } from "@/lib/tts-utils";

interface Message {
    role: "user" | "assistant";
    content: string;
    image?: string;
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isAutoSpeak, setIsAutoSpeak] = useState(false);
    const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        setSelectedImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage = input.trim();
        const currentImage = selectedImage;
        const currentFile = selectedImageFile;

        setInput("");
        removeSelectedImage();

        const newMessage: Message = { role: "user", content: userMessage };
        if (currentImage) newMessage.image = currentImage;

        setMessages((prev) => [...prev, newMessage]);
        playSound(sendSoundUrl);
        setIsLoading(true);

        try {
            // Prepare payload
            const payload: any = { message: userMessage, history: messages };

            if (currentImage && currentFile) {
                // Extract base64 without the data URL prefix
                const base64Data = currentImage.split(',')[1];
                payload.attachments = [
                    {
                        data: base64Data,
                        mimeType: currentFile.type
                    }
                ];
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

                // Auto-speak if enabled
                if (isAutoSpeak && tts) {
                    setSpeakingIdx(messages.length + 1); // Approximate index
                    tts.speak(data.reply, () => setSpeakingIdx(null));
                }
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
        <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in fade-in slide-in-from-bottom-1 relative overflow-hidden">
            {/* Background Orbs for Gemini vibe */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" />

            <div
                className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full relative z-10 overflow-hidden h-full"
                dir="rtl"
            >
                {/* Header */}
                <div className="p-6 md:px-12 md:py-8 flex justify-between items-center bg-transparent backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <span className="text-3xl md:text-5xl relative z-10">🤖</span>
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-5xl font-black text-gradient tracking-tight">الدحيح - مساعدك الذكي</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></span>
                                <p className="text-[10px] md:text-sm text-white/40 uppercase tracking-[0.5em] font-black">AI CURRICULUM SPECIALIST</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsAutoSpeak(!isAutoSpeak)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-black uppercase tracking-widest ${isAutoSpeak ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/10 border-white/10 text-white/40'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v10a3 3 0 006 0V3a3 3 0 00-3-3z" /></svg>
                            {isAutoSpeak ? "إيقاف" : "صوت"}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-3xl transition-all text-white/50 hover:text-white border border-white/5 hover:border-white/20 active:scale-90 group"
                        >
                            <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-12 scrollbar-hide">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} animate-in slide-in-from-bottom-8 duration-500`}
                        >
                            <div
                                className={`max-w-[85%] md:max-w-[80%] p-6 md:p-10 rounded-[2.5rem] text-lg md:text-2xl leading-[1.6] shadow-2xl relative group ${msg.role === "user"
                                    ? "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-white rounded-tr-none"
                                    : "bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white/95 rounded-tl-none backdrop-blur-2xl"
                                    }`}
                            >
                                {/* Message Content */}
                                <div className="relative z-10 space-y-4">
                                    {msg.image && (
                                        <div className="relative rounded-2xl overflow-hidden border border-white/10 mt-2 max-w-sm">
                                            <img src={msg.image} alt="Uploaded attachment" className="w-full h-auto object-contain" />
                                        </div>
                                    )}
                                    {msg.content && <div className="whitespace-pre-wrap">{msg.content}</div>}

                                    {/* TTS Speak Button for Assistant */}
                                    {msg.role === "assistant" && tts && (
                                        <button
                                            onClick={() => {
                                                if (speakingIdx === idx) {
                                                    tts?.stop();
                                                    setSpeakingIdx(null);
                                                } else {
                                                    setSpeakingIdx(idx);
                                                    tts?.speak(msg.content, () => setSpeakingIdx(null));
                                                }
                                            }}
                                            className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-all border ${speakingIdx === idx ? 'bg-primary border-primary text-black' : 'bg-white/10 border-white/10 text-white/40 hover:bg-white/20 hover:text-white'}`}
                                        >
                                            <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {speakingIdx === idx ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1z" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                )}
                                            </svg>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{speakingIdx === idx ? "جاري التحدث..." : "استمع للدحيح"}</span>
                                        </button>
                                    )}
                                </div>
                                {/* Message Overlay Decor */}
                                <div className={`absolute top-0 ${msg.role === "user" ? "left-0" : "right-0"} w-32 h-32 bg-white/5 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-end animate-in fade-in duration-300">
                            <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] rounded-tl-none flex gap-4 shadow-3xl backdrop-blur-3xl">
                                <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
                                <div className="w-4 h-4 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-20" />
                </div>

                {/* Input Dock */}
                <div className="px-6 md:px-20 pb-10 md:pb-16 flex flex-col items-center">

                    {/* Image Preview Area */}
                    {selectedImage && (
                        <div className="w-full max-w-6xl mb-4 ml-auto">
                            <div className="inline-block relative bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-xl animate-in zoom-in duration-300">
                                <img src={selectedImage} alt="Preview" className="h-24 w-auto rounded-xl object-contain bg-black/20" />
                                <button
                                    onClick={removeSelectedImage}
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

                                {/* Upload Button */}
                                <div className="flex items-end pb-1 pr-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-4 bg-white/5 hover:bg-white/15 rounded-2xl transition-all text-white/50 hover:text-white border border-transparent hover:border-white/10 group active:scale-95"
                                        title="إرفاق صورة"
                                    >
                                        <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                                        placeholder="حابب تسأل الدحيح عن إيه في المنهج يا بطل؟"
                                        className="w-full bg-transparent border-none px-4 py-4 md:py-6 text-xl md:text-3xl text-white placeholder:text-white/20 focus:outline-none transition-all resize-none max-h-[200px] scrollbar-hide"
                                    />
                                </div>
                                <div className="flex items-end justify-end">
                                    <button
                                        onClick={handleSend}
                                        disabled={isLoading || (!input.trim() && !selectedImage)}
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
