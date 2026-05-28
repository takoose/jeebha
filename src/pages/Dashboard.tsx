import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { triggerDownload } from '../components/APKDownloader';
import { useTranslation } from '../context/LanguageContext';

export default function Dashboard() {
  const { t } = useTranslation();
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  useEffect(() => {
    // Automatically trigger the APK download once when they hit the dashboard
    triggerDownload();
    setDownloadTriggered(true);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8 font-sans text-navy">
      {/* Launch Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy to-slate-800 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-yellow" />
              {t('hero.badge')}
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
              {t('dash.title').split('now')[0]} <br/>
              {t('dash.title').includes('now') ? <span className="text-yellow italic">now Mobile.</span> : ''}
            </h1>
            <p className="text-slate-300 font-medium text-base md:text-lg max-w-xl leading-relaxed">
              {t('dash.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0">
            <button 
              onClick={() => {
                triggerDownload();
                setDownloadTriggered(true);
              }}
              className="w-full lg:w-auto bg-yellow text-navy px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow/20 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              {t('hero.btn_download')}
            </button>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                {t('hero.spec_os')}: Android
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Step-by-Step Installation Instruction Card */}
        <div className="md:col-span-2 bg-white rounded-[3rem] p-8 md:p-10 border border-slate-100 shadow-xl space-y-8 flex flex-col justify-between">
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t('install.steps_badge')}
            </span>
            <h3 className="text-2xl font-black text-navy uppercase italic tracking-tight">
              {t('install.guide_title')}
            </h3>
          </div>

          <div className="space-y-6">
            <InstructionRow 
              num="01" 
              title={t('modal.step1_title')} 
              desc={t('modal.step1_desc')} 
            />
            <InstructionRow 
              num="02" 
              title={t('modal.step2_title')} 
              desc={t('modal.step2_desc')} 
            />
            <InstructionRow 
              num="03" 
              title={t('modal.step3_title')} 
              desc={t('modal.step3_desc')} 
            />
          </div>

          {downloadTriggered && (
            <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
              ✔ {t('hero.download_success')}
            </div>
          )}
        </div>

        {/* Specifications & Compatibility Panel */}
        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-10 border border-slate-100 text-left flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Jeebha Logistics System
              </span>
              <h3 className="text-2xl font-black text-navy uppercase italic tracking-tight font-sans">
                {t('dash.specs_title')}
              </h3>
            </div>

            <div className="space-y-4">
              <SpecDetail label={t('dash.compat_size')} value="18.2 MB" />
              <SpecDetail label={t('dash.compat_released')} value="May 2026" />
              <SpecDetail label={t('dash.compat_os')} value="Android 8.0+" />
              <SpecDetail label={t('dash.compat_cpu')} value="ARM64 / x86" />
              <SpecDetail label={t('dash.compat_perm')} value={t('dash.compat_perm_val')} />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200/60 space-y-4">
            <div className="flex items-center gap-3 text-navy">
              <div className="w-10 h-10 bg-yellow/10 rounded-xl flex items-center justify-center text-yellow shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest leading-none">
                {t('dash.compat_safe')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              {t('dash.compat_safe_desc')}
            </p>
          </div>
        </div>

      </div>

      {/* Highlights / Features Banner */}
      <div className="bg-yellow rounded-[3rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-navy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-6 text-left">
          <div className="w-14 h-14 bg-navy text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <Zap size={28} className="text-yellow animate-pulse" />
          </div>
          <div>
            <h4 className="text-xl font-black uppercase tracking-tight">
              {t('hero.driver_active')}
            </h4>
            <p className="text-xs font-extrabold uppercase text-navy/60 tracking-wider">
              {t('hero.driver_sub')}
            </p>
          </div>
        </div>
        <button 
          onClick={triggerDownload}
          className="bg-navy text-white hover:bg-slate-800 transition-colors px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shrink-0 shadow-xl"
        >
          {t('hero.become_partner')}
        </button>
      </div>
    </div>
  );
}

function InstructionRow({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 text-left font-sans">
      <span className="text-3xl font-black text-yellow italic leading-none shrink-0 select-none">
        {num}
      </span>
      <div className="space-y-0.5">
        <h4 className="font-extrabold text-navy text-base leading-tight uppercase tracking-tight">{title}</h4>
        <p className="text-slate-500 text-xs font-semibold leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SpecDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-200/60 last:border-0 text-xs font-sans">
      <span className="font-extrabold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="font-black text-navy">{value}</span>
    </div>
  );
}
