import PageTemplate from '../components/PageTemplate';
import { Ruler, FileText, Lightbulb } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Consultancy() {
  const { t } = useTranslation();
  return (
    <PageTemplate 
      title={t('consultancy.title')}
      subtitle={t('consultancy.subtitle')}
      heroImage="/img/team_photo.png"
      content={
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-12 bg-navy text-white rounded-[3rem]">
              <Lightbulb size={40} className="text-yellow mb-8" />
              <h3 className="text-3xl font-black mb-4">{t('consultancy.tech_title')}</h3>
              <p className="text-slate-400 font-medium">{t('consultancy.tech_desc')}</p>
           </div>
           <div className="p-12 bg-slate-50 rounded-[3rem]">
              <FileText size={40} className="text-navy mb-8" />
              <h3 className="text-3xl font-black mb-4 text-navy">{t('consultancy.audits_title')}</h3>
              <p className="text-slate-500 font-medium">{t('consultancy.audits_desc')}</p>
           </div>
        </div>
      }
    />
  );
}
