"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, accentColors, AccentColor } from './ThemeContext';

export default function AppearanceSettings({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const { theme, setTheme, accentColor, setAccentColor } = useTheme();

    const toggleOpen = () => setIsOpen(!isOpen);

    const themeOptions = [
        { id: 'system', label: 'تلقائي', icon: <MonitorIcon /> },
        { id: 'dark', label: 'غامق', icon: <MoonIcon /> },
    ] as const;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleOpen}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[101]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 inset-x-4 md:left-1/2 md:right-auto md:-translate-x-1/2 w-auto md:w-full md:max-w-sm glass-card border border-white/10 p-6 z-[102] translate-x-0"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BrushIcon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-foreground">إعدادات المظهر</h3>
                        </div>

                        {/* Theme Section */}
                        <div className="mb-8">
                            <p className="text-sm font-bold text-foreground/50 mb-4 mr-1">الثيم</p>
                            <div className="grid grid-cols-2 gap-2 bg-foreground/5 p-1 rounded-2xl border border-white/5">
                                {themeOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setTheme(opt.id)}
                                        className={`relative flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${theme === opt.id
                                            ? 'text-primary'
                                            : 'text-foreground/40 hover:text-foreground/60'
                                            }`}
                                    >
                                        {theme === opt.id && (
                                            <motion.div
                                                layoutId="activeTheme"
                                                className="absolute inset-0 bg-card border border-white/10 shadow-lg rounded-xl"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{opt.icon}</span>
                                        <span className="relative z-10 text-[10px] font-black">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accent Color Section */}
                        <div>
                            <p className="text-sm font-bold text-foreground/50 mb-4 mr-1">اللون الأساسي</p>
                            <div className="grid grid-cols-3 gap-2 md:gap-4 justify-items-center">
                                {(Object.keys(accentColors) as AccentColor[]).map((key) => {
                                    const color = accentColors[key];
                                    const isActive = accentColor === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setAccentColor(key)}
                                            className={`group flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${isActive ? 'bg-foreground/5 border border-white/5 shadow-inner' : 'hover:bg-foreground/5'
                                                }`}
                                        >
                                            <div className="relative">
                                                <div
                                                    className="w-10 h-10 rounded-full shadow-lg transition-transform group-hover:scale-110"
                                                    style={{ backgroundColor: color.color }}
                                                />
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeColor"
                                                        className="absolute -inset-1 border-2 border-primary rounded-full"
                                                        transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                                    />
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-black transition-colors ${isActive ? 'text-foreground' : 'text-foreground/40'
                                                }`}>
                                                {color.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom Decoration */}
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Simple internal icons as SVGs
function SunIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function MoonIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );
}

function MonitorIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function BrushIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    );
}
