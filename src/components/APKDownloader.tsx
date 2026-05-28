import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, ShieldAlert, ArrowDownToLine, ChevronRight, Smartphone } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface APKDownloaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function triggerDownload() {
  const url = (import.meta as any).env.VITE_APK_DOWNLOAD_URL || '/jeebha.apk';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.open(url, '_blank');
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'jeebha.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default function APKDownloader({ isOpen, onClose }: APKDownloaderProps) {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isOpen) {
      // Trigger the physical download automatically when modal opens
      triggerDownload();
    }
  }, [isOpen]);

  const steps = [
    {
      num: '01',
      title: t('modal.step1_title'),
      description: t('modal.step1_desc'),
      actionLink: true,
    },
    {
      num: '02',
      title: t('modal.step2_title'),
      description: t('modal.step2_desc'),
    },
    {
      num: '03',
      title: t('modal.step3_title'),
      description: t('modal.step3_desc'),
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow rounded-xl flex items-center justify-center text-navy shadow-lg shadow-yellow/20">
                  <Smartphone size={20} className="animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter">
                    {t('modal.install_mobile')}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {t('modal.prod_release')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              {/* Status Section */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                    <ArrowDownToLine size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-navy text-lg leading-tight">
                      {t('modal.fast_download')}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium">
                      {t('modal.download_desc')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={triggerDownload}
                  className="bg-navy hover:bg-yellow hover:text-navy text-white hover:scale-105 active:scale-95 transition-all px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shrink-0 shadow-lg shadow-navy/10"
                >
                  <Download size={14} />
                  {t('modal.restart_btn')}
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                  {t('install.guide_title')}
                </h4>
                <div className="grid gap-4">
                  {steps.map((step) => (
                    <div
                      key={step.num}
                      className="flex items-start gap-4 p-5 bg-white border border-slate-100 hover:border-yellow rounded-2xl transition-all group"
                    >
                      <span className="text-2xl font-black text-yellow italic leading-none shrink-0 group-hover:scale-110 transition-transform select-none">
                        {step.num}
                      </span>
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-navy text-sm uppercase tracking-tight leading-tight">
                          {step.title}
                        </h5>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed">
                          {step.description}
                          {step.actionLink && (
                            <button
                              onClick={triggerDownload}
                              className="text-yellow hover:underline font-extrabold inline-flex items-center gap-1 cursor-pointer pl-1"
                            >
                              {t('modal.step1_click')} <ChevronRight size={10} />
                            </button>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs font-semibold leading-relaxed flex gap-3 text-left">
                <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p>{t('modal.protect_notice')}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                {t('modal.super_app')}
              </span>
              <button
                onClick={onClose}
                className="bg-yellow text-navy hover:bg-navy hover:text-white hover:scale-105 transition-all px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow/10"
              >
                {t('hero.got_it')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
