"use client";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative isolate min-h-screen">
            {children}
        </div>
    );
}
