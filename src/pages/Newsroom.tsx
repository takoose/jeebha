import PageTemplate from '../components/PageTemplate';
import { Search, Info } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function HelpCenter() {
  const { t } = useTranslation();

  return (
    <PageTemplate 
      title={t('help.title')}
      subtitle={t('help.subtitle')}
      content={
        <div className="space-y-12">
           <div className="relative max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text" 
                placeholder={t('help.search')}
                className="w-full bg-slate-50 border-2 border-transparent rounded-full py-6 pl-16 pr-8 font-bold text-navy focus:border-yellow focus:bg-white outline-none transition-all"
              />
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              <TopicCard title="Account & Profile" count={12} suffix={t('help.articles')} />
              <TopicCard title="Ordering Materials" count={8} suffix={t('help.articles')} />
              <TopicCard title="Booking Logistics" count={15} suffix={t('help.articles')} />
              <TopicCard title="Payments & Invoices" count={6} suffix={t('help.articles')} />
           </div>
        </div>
      }
    />
  );
}

function TopicCard({ title, count, suffix }: any) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-all cursor-pointer flex items-center justify-between">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
             <Info size={20} />
          </div>
          <h4 className="font-bold text-navy">{title}</h4>
       </div>
       <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{count} {suffix}</span>
    </div>
  );
}
