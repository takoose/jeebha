import PageTemplate from '../components/PageTemplate';
import { Truck } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function SiteLogistics() {
  const { t } = useTranslation();

  return (
    <PageTemplate 
      title={t('nav.logistics')}
      subtitle={t('logistics.subtitle')}
      heroImage="/img/logistics_fleet.png"
      content={
        <div className="space-y-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-6">
                <h3 className="text-4xl font-black text-navy tracking-tight">{t('logistics.visibility_title')}</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                   {t('logistics.visibility_desc')}
                </p>
                <div className="flex gap-4 pt-4">
                   <div className="px-6 py-3 bg-slate-100 rounded-full font-bold text-navy text-sm">{t('logistics.gps_tracking')}</div>
                   <div className="px-6 py-3 bg-slate-100 rounded-full font-bold text-navy text-sm">{t('logistics.eta_prediction')}</div>
                </div>
             </div>
             <div className="bg-slate-100 rounded-[3rem] aspect-square flex items-center justify-center">
                <Truck size={120} className="text-slate-300" />
             </div>
          </div>
        </div>
      }
    />
  );
}
