import PageTemplate from '../components/PageTemplate';
import { ShieldCheck, Eye, Lock } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Safety() {
  const { t } = useTranslation();
  return (
    <PageTemplate 
      title={t('safety.title')}
      subtitle={t('safety.subtitle')}
      heroImage="/img/icon_safety.png"
      content={
        <div className="grid md:grid-cols-3 gap-8 text-center">
           <div className="p-10 space-y-6">
              <ShieldCheck size={48} className="text-yellow mx-auto" />
              <h3 className="text-2xl font-black text-navy uppercase italic">{t('safety.partners_title')}</h3>
              <p className="text-slate-500 font-medium">{t('safety.partners_desc')}</p>
           </div>
           <div className="p-10 space-y-6">
              <Eye size={48} className="text-yellow mx-auto" />
              <h3 className="text-2xl font-black text-navy uppercase italic">{t('safety.monitor_title')}</h3>
              <p className="text-slate-500 font-medium">{t('safety.monitor_desc')}</p>
           </div>
           <div className="p-10 space-y-6">
              <Lock size={48} className="text-yellow mx-auto" />
              <h3 className="text-2xl font-black text-navy uppercase italic">{t('safety.payments_title')}</h3>
              <p className="text-slate-500 font-medium">{t('safety.payments_desc')}</p>
           </div>
        </div>
      }
    />
  );
}
