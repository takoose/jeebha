import PageTemplate from '../components/PageTemplate';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <PageTemplate 
      title={t('contact.title')}
      subtitle={t('contact.subtitle')}
      content={
        <div className="grid lg:grid-cols-3 gap-8">
           <ContactCard icon={Mail} title={t('contact.email')} value="hello@jeebha.com" />
           <ContactCard icon={Phone} title={t('contact.phone')} value="+213 550 00 00 00" />
           <ContactCard icon={MapPin} title={t('contact.hq')} value="Didouche Mourad, Algiers" />
        </div>
      }
    />
  );
}

function ContactCard({ icon: Icon, title, value }: any) {
  return (
    <div className="p-12 bg-slate-50 rounded-[3rem] text-center">
       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-navy mx-auto mb-8 shadow-sm">
          <Icon size={28} />
       </div>
       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{title}</p>
       <h4 className="text-xl font-bold text-navy">{value}</h4>
    </div>
  );
}
