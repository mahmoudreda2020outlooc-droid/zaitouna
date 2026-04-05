"use client";

import { ThemeProvider } from "@/components/ThemeContext";
import AppearanceSettings from "@/components/AppearanceSettings";
import { useState, useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [appearanceOpen, setAppearanceOpen] = useState(false);

    // Provide a way to open settings globally
    useEffect(() => {
        const handleOpen = () => setAppearanceOpen(true);
        window.addEventListener('open-appearance', handleOpen);
        return () => window.removeEventListener('open-appearance', handleOpen);
    }, []);

    return (
        <ThemeProvider>
            <div className="relative isolate min-h-screen">
                {children}
                <AppearanceSettings isOpen={appearanceOpen} setIsOpen={setAppearanceOpen} />
            </div>
        </ThemeProvider>
    );
}
