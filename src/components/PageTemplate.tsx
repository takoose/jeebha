import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

interface PageTemplateProps {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  heroImage?: string;
}

export default function PageTemplate({ title, subtitle, content, heroImage }: PageTemplateProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl lg:text-3xl font-black italic tracking-tighter text-navy flex items-center gap-2 sm:gap-4 group">
            <img src="/img/jeebha.svg" alt="Jeebha" className="w-10 h-10 lg:w-14 lg:h-14 group-hover:scale-110 transition-transform" />
            Jeebha
          </Link>
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-navy transition-colors font-bold text-xs sm:text-sm uppercase tracking-widest">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">{t('template.back_to_home')}</span>
            <span className="inline sm:hidden">{t('template.back')}</span>
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-4 sm:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center mb-12 lg:mb-20">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block p-2 bg-yellow/10 rounded-full px-4 sm:px-6 font-bold text-yellow border border-yellow/20 text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6"
              >
                {t('template.official_page')}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-6xl font-black text-navy leading-tight lg:leading-none tracking-tighter mb-4 lg:mb-8"
              >
                {title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-xl"
              >
                {subtitle}
              </motion.p>
            </div>
            {heroImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-video rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-2xl"
              >
                 <img src={heroImage} className="w-full h-full object-cover" alt={title} />
                 <div className="absolute inset-0 bg-navy/25 animate-fade-in"></div>
              </motion.div>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {content}
          </motion.div>

          {/* Call to Action */}
          <div className="mt-16 lg:mt-32 p-6 sm:p-12 bg-navy rounded-3xl lg:rounded-[3rem] text-white overflow-hidden relative group">
             <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
                <div>
                   <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2">{t('template.ready')}</h3>
                   <p className="text-slate-400 font-medium text-sm sm:text-base">{t('template.cta_sub')}</p>
                </div>
                <Link to="/login" className="w-full lg:w-auto text-center justify-center bg-yellow text-navy px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-yellow/20">
                   {t('template.get_started_now')}
                   <ArrowRight size={18} />
                </Link>
             </div>
             {/* Decor */}
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow/10 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 py-12 px-8 border-t border-slate-100">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span>&copy; 2026 Jeebha Technologies.</span>
            <div className="flex gap-8">
               <span className="hover:text-navy cursor-pointer">{t('footer.privacy')}</span>
               <span className="hover:text-navy cursor-pointer">{t('footer.terms')}</span>
               <span className="hover:text-navy cursor-pointer" onClick={() => window.location.href = '/contact'}>{t('nav.contact')}</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
