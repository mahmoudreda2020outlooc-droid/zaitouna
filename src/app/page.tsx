"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InstallButton from "@/components/InstallButton";

const baladiQuotes = [
  { main: "عافر هتوصل،", subMain: "مفيش حاجة تيجي بالساهل!", quote: "اتعب النهاردة عشان ترتاح بكرة، ومستقبلك يستاهل العافرة." },
  { main: "الزتونة في جيبك،", subMain: "بس محتاج تشد حيلك شويه.", quote: "المواد تقيلة؟ عاادي، إحنا اللي بنعمل المستحيل والحل دايمًا هنا." },
  { main: "هانت يا بطل،", subMain: "فاضل على الحلو تكّة!", quote: "كل خطوة بتمشيها النهاردة هي اللي بتبني بطل بكرة الشاطر." },
  { main: "ذاكر بذكاء،", subMain: "مش لازم تفرُم نفسك!", quote: "الزتونة بتبسطلك الصعب، ركز في المهم وسيب الباقي علينا." },
  { main: "مفيش مستحيل،", subMain: "إنت قدها وقدود!", quote: "الكلية محتاجة دماغ رايقة وعزيمة حديد، وإنت عندك الاتنين." },
  { main: "الزتونة المجنونة،", subMain: "بتجيب من الآخر!", quote: "مش محتاج تحفظ، إحنا هنفهمك المعلومة وهيا لسه سخنة." },
  { main: "إنت التنين المجنّح،", subMain: "بس ناقصك تطير!", quote: "الكلية مهارة، والزتونة هي الشطارة اللي هتخليك بريمو في مجالك." },
  { main: "دماغك دي ألماظ،", subMain: "بس محتاج تتصنفر شويه.", quote: "سيبك من التعقيد، إحنا هنا في الزتونة عشان نخلي الصعب ميه." },
  { main: "الزتونة مش بس مادة،", subMain: "دي أسلوب حياة!", quote: "ركز في اللي بين السطور، وهتلاقي الحل جالك في ثانية من غير أي مجهود." }
];

export default function HomePage() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();
  const [currentQuote, setCurrentQuote] = useState(baladiQuotes[0]);

  useEffect(() => {
    // Auth is handled by server-side middleware.
    // Fetching user data from the protected API.
    const checkUser = async () => {
      try {
        const res = await fetch('/api/student-lookup?check=true');
        if (res.ok) {
          const data = await res.json();
          setUser(data.student);
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    const randomQuote = baladiQuotes[Math.floor(Math.random() * baladiQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  if (!user) return null;


  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
        <div className="orb w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 md:bg-primary/20 -top-20 -left-20 md:-top-40 md:-left-40" />
        <div className="orb w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-secondary/10 md:bg-secondary/15 bottom-0 -right-10 md:-right-20" style={{ animationDelay: '-4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_100%)] hidden md:block" />
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto" dir="rtl">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-12 md:mb-20">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center text-white text-xl font-bold relative border border-white/10">
                {user.name.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1 py-1 md:py-2 text-gradient drop-shadow-[0_2px_10px_rgba(0,242,255,0.15)]">{user.name}</h2>
              <p className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 pr-1 border-r-2 border-primary/20">فرقة تانية - قسم تكنولوجيا المعلومات</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* InstallButton removed from here */}
          </div>
        </header>

        {/* Bento Dashboard */}
        <div className="bento-grid">
          {/* Motivational Quote Hero */}
          <div className="col-span-full glass-card p-6 md:p-12 lg:p-20 relative overflow-hidden flex flex-col justify-end min-h-[400px] md:min-h-[450px] border-white/5 shadow-2xl">
            {/* Premium Mesh Gradients */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,242,255,0.15),transparent_50%)] -z-10" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(189,101,255,0.1),transparent_50%)] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full h-full">
              {/* Text Side */}
              <div className="max-w-3xl pr-2">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/20 backdrop-blur-md">إلهام اليوم</div>

                <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight drop-shadow-2xl">
                  {currentQuote.main} <span className="text-gradient block md:inline-block mt-2 md:mt-0">{currentQuote.subMain}</span>
                </h1>

                <p className="text-white/70 text-sm md:text-xl font-medium mb-8 leading-relaxed max-w-2xl border-r-2 border-primary/30 pr-4 md:pr-6">
                  "{currentQuote.quote}"
                </p>

                <div className="flex flex-wrap gap-6 items-center">
                  <button
                    onClick={() => router.push("/subjects")}
                    className="btn-premium px-10 py-5 text-base shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                  >
                    زتونة المواد
                  </button>
                  <button
                    onClick={() => router.push("/beeba")}
                    className="btn-ai group/ai relative"
                  >
                    <span className="relative z-10">اسأل الدحيح يابية</span>
                    <svg className="w-5 h-5 ai-icon text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover/ai:translate-x-[100%] transition-transform duration-1000" />
                  </button>

                  <InstallButton />
                </div>
              </div>

              {/* Graphic Side */}
              <div className="relative flex justify-center items-center h-[240px] md:h-[300px] lg:h-full mt-6 md:mt-10 lg:mt-0">
                {/* Custom Zaitouna SVG Animation */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 graphic-container">

                  {/* Glowing Aura Behind */}
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse"></div>
                  <div className="absolute inset-10 bg-secondary/20 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }}></div>

                  <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl overflow-visible">
                    <defs>
                      {/* Gradients */}
                      <linearGradient id="oliveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#14532d" />
                      </linearGradient>
                      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                      <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#94a3b8" />
                      </linearGradient>
                      {/* Glow Filter - Simplified for mobile */}
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" className="md:std-deviation-8" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Floating Papers (Background) */}
                    <g className="papers-bg">
                      <rect x="250" y="80" width="60" height="80" rx="4" fill="url(#paperGradient)" opacity="0.6" transform="rotate(15 280 120)" className="floating-paper-1" />
                      <rect x="60" y="200" width="50" height="70" rx="4" fill="url(#paperGradient)" opacity="0.4" transform="rotate(-25 85 235)" className="floating-paper-2" />
                    </g>

                    {/* The Zaitouna (Olive Base) */}
                    <g className="zaitouna-body floating will-change-transform">
                      <ellipse cx="200" cy="270" rx="70" ry="90" fill="url(#oliveGradient)" filter="url(#glow)" />
                      {/* Olive reflection highlight */}
                      <path d="M 160 210 Q 180 190 200 200" stroke="rgba(255,255,255,0.4)" strokeWidth="6" strokeLinecap="round" fill="none" />
                      {/* Small leaf */}
                      <path d="M 240 190 Q 280 160 290 190 Q 260 210 240 190" fill="#4ade80" />
                    </g>

                    {/* The Brain (Emerging from top) */}
                    <g className="brain-part brain-pulse will-change-transform">
                      <path d="M 140 180 C 120 120 180 80 200 120 C 220 80 280 120 260 180 Z" fill="url(#brainGradient)" filter="url(#glow)" opacity="0.9" />
                      {/* Brain folds/lines */}
                      <path d="M 200 100 V 170" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                      <path d="M 160 140 Q 180 120 200 130" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 240 140 Q 220 120 200 130" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>

                    {/* Floating Papers (Foreground) */}
                    <g className="papers-fg">
                      <rect x="100" y="40" width="70" height="90" rx="4" fill="url(#paperGradient)" transform="rotate(-15 135 85)" className="floating-paper-3" filter="url(#glow)" />
                      <rect x="230" y="40" width="80" height="100" rx="4" fill="#ffffff" transform="rotate(25 270 90)" className="floating-paper-4" filter="url(#glow)" />
                      {/* Lines on the main paper */}
                      <g transform="rotate(25 270 90)">
                        <line x1="245" y1="60" x2="295" y2="60" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                        <line x1="245" y1="75" x2="295" y2="75" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                        <line x1="245" y1="90" x2="280" y2="90" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                      </g>
                    </g>

                    {/* Sparkles/Stars - Reduced for performance */}
                    <g className="sparkles hidden md:block">
                      <circle cx="100" cy="150" r="4" fill="#00f2ff" className="glow-pulse" />
                      <circle cx="300" cy="120" r="6" fill="#00f2ff" className="glow-pulse" style={{ animationDelay: '0.5s' }} />
                      <circle cx="280" cy="280" r="3" fill="#a855f7" className="glow-pulse" style={{ animationDelay: '1s' }} />
                      <circle cx="120" cy="270" r="5" fill="#a855f7" className="glow-pulse" style={{ animationDelay: '1.5s' }} />
                    </g>
                    <g className="sparkles md:hidden">
                      <circle cx="100" cy="150" r="3" fill="#00f2ff" />
                      <circle cx="300" cy="120" r="4" fill="#00f2ff" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Area */}
        <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-black">Z</div>
            <p className="text-[10px] uppercase tracking-widest font-black leading-tight">Az-Zaitouna<br />Learning Hub</p>
          </div>

          <div className="flex gap-8 items-center justify-center">
            {/* DeveloperCard moved to RootLayout */}
          </div>

          <div className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Independent Student Initiative
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
