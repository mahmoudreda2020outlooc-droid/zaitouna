"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'system';

export const accentColors = {
    mint: { name: 'تركواز', color: '#2dd4bf', secondary: '#0d9488' },
    grape: { name: 'بنفسجي', color: '#a855f7', secondary: '#7e22ce' },
    banana: { name: 'أصفر', color: '#facc15', secondary: '#ca8a04' },
    ocean: { name: 'أزرق', color: '#38bdf8', secondary: '#0284c7' },
    bubblegum: { name: 'وردي', color: '#f472b6', secondary: '#db2777' },
    sunset: { name: 'برتقالي', color: '#fb923c', secondary: '#ea580c' },
};

export type AccentColor = keyof typeof accentColors;

interface ThemeContextType {
    theme: Theme;
    accentColor: AccentColor;
    setTheme: (theme: Theme) => void;
    setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [accentColor, setAccentColorState] = useState<AccentColor>('mint');

    // Load from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const savedColor = localStorage.getItem('accentColor') as AccentColor;

        if (savedTheme) setThemeState(savedTheme);
        if (savedColor && accentColors[savedColor]) setAccentColorState(savedColor);
    }, []);

    // Update document and localStorage when theme or color changes
    useEffect(() => {
        const root = window.document.documentElement;

        // Handle Dark/System
        const applyTheme = (t: Theme) => {
            root.classList.remove('light', 'dark');
            if (t === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add('dark');
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        // Handle Accent Color
        const activeColor = accentColors[accentColor];
        root.style.setProperty('--primary', activeColor.color);
        root.style.setProperty('--secondary', activeColor.secondary);
        localStorage.setItem('accentColor', accentColor);

        // If system theme is active, listen for changes
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme, accentColor]);

    const setTheme = (t: Theme) => setThemeState(t);
    const setAccentColor = (c: AccentColor) => setAccentColorState(c);

    return (
        <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
