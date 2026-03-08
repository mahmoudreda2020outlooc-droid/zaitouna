"use client";

class TTSManager {
    private static instance: TTSManager;
    private synth: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];

    private constructor() {
        if (typeof window !== "undefined") {
            this.synth = window.speechSynthesis;
            this.loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    public static getInstance(): TTSManager {
        if (!TTSManager.instance) {
            TTSManager.instance = new TTSManager();
        }
        return TTSManager.instance;
    }

    private loadVoices() {
        if (!this.synth) return;
        this.voices = this.synth.getVoices();
    }

    public stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }

    public speak(text: string, onEnd?: () => void) {
        if (!this.synth) return;

        // Stop any current speech
        this.stop();

        // Clean text from markdown-like syntaxes and link markers if any
        const cleanText = text
            .replace(/[*_~`]/g, '')
            .replace(/LINK:\s*.+$/m, '')
            .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Find best Arabic voice
        const arabicVoice = this.voices.find(v => v.lang.startsWith('ar')) ||
            this.voices.find(v => v.name.includes('Arabic'));

        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }

        utterance.lang = 'ar-SA';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        this.synth.speak(utterance);
    }
}

export const tts = typeof window !== "undefined" ? TTSManager.getInstance() : null;
