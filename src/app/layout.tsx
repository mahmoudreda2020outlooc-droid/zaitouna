import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DeveloperCard from "@/components/DeveloperCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "الزتونة | Az-Zaitouna",
  description: "الزتونة - المنصة التعليمية الذكية للطلاب. المذاكرة بذكاء مش بمجهود.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 min-h-screen bg-background`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', (e) => e.preventDefault());
              document.addEventListener('keydown', (e) => {
                if (
                  e.key === 'F12' ||
                  (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                  (e.ctrlKey && e.key === 'U')
                ) {
                  e.preventDefault();
                }
              });
              // Redirection is handled by middleware, but we can clear local storage 
              // to stay consistent with the new cookie-based system.
              localStorage.removeItem("user");
            `,
          }}
        />
        <div className="relative isolate min-h-screen">
          {children}
          {/* Spacer to ensure content isn't hidden behind the fixed card */}
          <div className="h-28 print:hidden" />
        </div>

        {/* Global Developer Card - Fixed at the very bottom */}
        <div className="fixed bottom-6 inset-x-0 z-[9999] flex justify-center pointer-events-none px-4">
          <DeveloperCard />
        </div>
      </body>
    </html>
  );
}
