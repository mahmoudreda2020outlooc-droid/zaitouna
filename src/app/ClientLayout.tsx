"use client";

import { ThemeProvider } from "@/components/ThemeContext";
import AppearanceSettings from "@/components/AppearanceSettings";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="relative isolate min-h-screen">
                {children}
                <AppearanceSettings />
            </div>
        </ThemeProvider>
    );
}
