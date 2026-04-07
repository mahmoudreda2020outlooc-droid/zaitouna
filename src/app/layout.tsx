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
  description: "الزتونة - المنصة التعليمية الذكية للطلاب. المذاكرة بذكاء مش بمجهود. ملخصات، محاضرات، واختبارات لطلاب تكنولوجيا المعلومات.",
  keywords: ["الزتونة", "Az-Zaitouna", "تعلم", "مذاكرة", "محاضرات", "ملخصات", "تكنولوجيا المعلومات", "LMS", "منصة تعليمية"],
  authors: [{ name: "محمود رضا" }],
  openGraph: {
    title: "الزتونة | Az-Zaitouna",
    description: "المنصة التعليمية الشاملة لطلاب تكنولوجيا المعلومات. المذاكرة بذكاء مش بمجهود.",
    url: "https://zaitouna-eaqs.vercel.app",
    siteName: "الزتونة",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "الزتونة | Az-Zaitouna",
    description: "المنصة التعليمية الشاملة لطلاب تكنولوجيا المعلومات.",
  },
  alternates: {
    canonical: "https://zaitouna-eaqs.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00f2ff" />
      </head>
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
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.deferredPrompt = null;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
                window.dispatchEvent(new Event('pwa-prompt-ready'));
              });

              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      if (!registration.active?.scriptURL.includes('sw-final.js')) {
                        registration.unregister();
                      }
                    }
                  });
                  navigator.serviceWorker.register('/sw-final.js');
                });
              }
            `,
          }}
        />

        <ClientLayout>
          {children}

          <footer className="w-full flex justify-center py-8 pb-12 relative z-50">
            <DeveloperCard />
          </footer>

        </ClientLayout>
      </body>
    </html>
  );
}
