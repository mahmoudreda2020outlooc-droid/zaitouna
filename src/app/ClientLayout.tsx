"use client";

import { useState } from "react";
import ChatBeeba from "@/components/ChatBeeba";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <div className="relative isolate min-h-screen">
                {children}
                {/* Spacer to ensure content isn't hidden behind the fixed card */}
                <div className="h-28 print:hidden" />
            </div>

            {/* Global Chat Toggle Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-24 right-6 z-[9998] w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-110 active:scale-95 transition-all group pointer-events-auto"
                title="اسأل الدحيح"
            >
                <span className="text-3xl group-hover:rotate-12 transition-transform">🤖</span>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0a0a0a] animate-pulse" />
            </button>

            {/* Global Chat Overlay */}
            <ChatBeeba isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
