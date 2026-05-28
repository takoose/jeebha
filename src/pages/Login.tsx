import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, ArrowLeft, ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { triggerDownload } from '../components/APKDownloader';
import { useTranslation } from '../context/LanguageContext';
import LanguagePicker from '../components/LanguagePicker';

export default function Login() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [downloadStarted, setDownloadStarted] = useState(false);

  // Automatically trigger APK download upon page load
  useEffect(() => {
    setDownloadStarted(true);
    triggerDownload();
  }, []);

  const installationGuide = [
    {
      step: '01',
      title: t('install.step1_title'),
      desc: t('install.step1_desc'),
    },
    {
      step: '02',
      title: t('install.step2_title'),
      desc: t('install.step2_desc'),
    },
    {
      step: '03',
      title: t('install.step3_title'),
      desc: t('install.step3_desc'),
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans flex flex-col justify-between relative overflow-hidden selection:bg-yellow selection:text-navy">
      {/* Visual background accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-4 sm:px-10 py-4 sm:py-8 relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-4 group">
          <img src="/img/jeebha.svg" alt="Jeebha/Logo" className="w-10 h-10 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform" />
          <span className="text-xl sm:text-3xl font-black italic tracking-tighter text-white group-hover:text-yellow transition-colors">Jeebha</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <LanguagePicker dark={true} />
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-slate-400 hover:text-white transition-all font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            <ArrowLeft size={16} />
            <span>{t('modal.restart_btn').includes('Res') ? 'Back' : 'Tura'}</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left column: Callouts / Details */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-10 text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-yellow" />
              {t('hero.badge')}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase italic leading-[0.95] md:leading-[0.9] tracking-tighter">
              {t('hero.title').split(' n')[0]} <br/>
              <span className="text-yellow">Jeebha Mobile</span> <br/>
              Super-App.
            </h1>
            <p className="text-slate-400 font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <SpecCard label={t('hero.spec_file')} value="jeebha.apk" />
            <SpecCard label={t('hero.spec_size')} value="~18.2 MB" />
            <SpecCard label={t('hero.spec_version')} value="v1.0.0" />
            <SpecCard label={t('hero.spec_os')} value="Android 8.0+" />
          </div>

          {/* Core App Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              onClick={triggerDownload}
              className="w-full sm:w-auto bg-yellow text-navy px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-yellow/20 flex items-center justify-center gap-3"
            >
              <Download size={18} />
              {t('hero.btn_download')}
            </button>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {t('hero.btn_playstore')}
              <ExternalLink size={14} className="opacity-60" />
            </a>
          </div>

          {downloadStarted && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl font-bold text-xs uppercase tracking-wider w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              {t('hero.download_success')}
            </div>
          )}
        </div>

        {/* Right column: Interactive Installation Wizard */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-[3rem] p-8 md:p-10 border border-white/10 space-y-8"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black text-yellow uppercase tracking-widest">
                {t('install.steps_badge')}
              </span>
              <h3 className="text-2xl font-black uppercase italic tracking-tight text-left">
                {t('install.guide_title')}
              </h3>
            </div>

            <div className="space-y-6">
              {installationGuide.map((item) => (
                <div key={item.step} className="flex gap-4 items-start group">
                  <span className="text-2xl font-black text-yellow/30 group-hover:text-yellow transition-colors italic leading-none pt-0.5 select-none">
                    {item.step}
                  </span>
                  <div className="space-y-1 text-left">
                    <h4 className="font-extrabold text-sm uppercase tracking-tight text-white">{item.title}</h4>
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-left text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold uppercase">
                <AlertCircle size={14} />
                {t('install.security_promise')}
              </div>
              <p className="opacity-80">
                {t('install.security_text')}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
        <span>&copy; 2026 JEEBHA LOGISTICS. ALL RIGHTS RESERVED.</span>
        <span>{t('modal.super_app')}</span>
      </footer>
    </div>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
      <span className="font-extrabold text-[#FACC15] text-sm tracking-tight">{value}</span>
    </div>
  );
}
