import PageTemplate from '../components/PageTemplate';
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
             
             {/* Replaced the Truck icon placeholder block with an image */}
             <div className="bg-slate-100 rounded-[3rem] aspect-square overflow-hidden">
                <img 
                  src="/img/visibility.png" // Replace with your actual image path
                  alt={t('logistics.visibility_title')} 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </div>
      }
    />
  );
}
