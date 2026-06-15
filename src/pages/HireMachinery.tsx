import PageTemplate from '../components/PageTemplate';
import { Settings, Hammer, Zap } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function HireMachinery() {
  const { t } = useTranslation();
  return (
    <PageTemplate 
      title={t('machinery.title')}
      subtitle={t('machinery.subtitle')}
      heroImage="/img/logistics_fleet.png"
      content={
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <EquipmentCard title={t('machinery.excavators')} price={`${t('machinery.from')} 15,000 DZD/${t('machinery.day')}`} />
           <EquipmentCard title={t('machinery.mixers')} price={`${t('machinery.from')} 8,000 DZD/${t('machinery.day')}`} />
           <EquipmentCard title={t('machinery.cranes')} price={`${t('machinery.from')} 25,000 DZD/${t('machinery.day')}`} />
        </div>
      }
    />
  );
}

function EquipmentCard({ title, price }: any) {
  return (
    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
       <div className="w-full aspect-square bg-slate-200 rounded-2xl mb-6"></div>
       <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
       <p className="text-yellow font-black text-sm uppercase tracking-widest">{price}</p>
    </div>
  );
}
