import PageTemplate from '../components/PageTemplate';
import { ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function MaterialsMarketplace() {
  const { t } = useTranslation();

  return (
    <PageTemplate 
      title={t('nav.materials')}
      subtitle={t('materials.subtitle')}
      heroImage="/img/materials_showcase.png"
      content={
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={ShoppingBag}
            title={t('materials.catalog_title')}
            desc={t('materials.catalog_desc')}
          />
          <FeatureCard 
            icon={Star}
            title={t('materials.quality_title')}
            desc={t('materials.quality_desc')}
          />
          <FeatureCard 
            icon={ShieldCheck}
            title={t('materials.payments_title')}
            desc={t('materials.payments_desc')}
          />
        </div>
      }
    />
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-2">
      <div className="w-16 h-16 bg-yellow rounded-2xl flex items-center justify-center text-navy mb-8">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-black text-navy mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
