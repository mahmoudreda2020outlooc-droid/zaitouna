import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DeveloperCard from "@/components/DeveloperCard";
import ClientLayout from "./ClientLayout";

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
              localStorage.removeItem("user");
            `,
          }}
        />

        <ClientLayout>
          {children}

          {/* Global Developer Card - Fixed at the very bottom inside ClientLayout wrapper */}
          <div className="fixed bottom-6 inset-x-0 z-[9999] flex justify-center pointer-events-none px-4">
            <DeveloperCard />
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
