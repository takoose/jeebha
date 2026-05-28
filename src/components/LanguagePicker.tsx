import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, Language } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguagePicker({ dark = false }: { dark?: boolean }) {
  const { language, setLanguage, dir } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'kab', label: 'ⵣ Taqbaylit', flag: '♓' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
          dark
            ? 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-800'
            : 'border-slate-200 hover:border-slate-300 bg-white/50 text-slate-700 hover:bg-white'
        } ${isOpen ? 'ring-2 ring-yellow' : ''}`}
      >
        <div className="flex items-center gap-1.5 font-sans">
          <Globe size={14} className="text-yellow" />
          <span>{currentLang.flag}</span>
          <span className="uppercase tracking-wider">{currentLang.code}</span>
        </div>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute mt-2 w-44 rounded-2xl shadow-2xl p-2 z-[999] border max-h-72 overflow-y-auto ${
              dark
                ? 'right-0 bg-[#0F172A] border-slate-800 text-white'
                : 'right-0 bg-white border-slate-100 text-navy'
            }`}
          >
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    language === lang.code
                      ? 'bg-yellow text-navy'
                      : dark
                      ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                  style={{ direction: lang.code === 'ar' ? 'rtl' : 'ltr' }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="font-sans">{lang.label}</span>
                  </span>
                  {language === lang.code && <Check size={14} className="shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
