import PageTemplate from '../components/PageTemplate';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <PageTemplate 
      title="Contact Us"
      subtitle="Have questions? Our team is available 24/7 to assist you. Reach out via any of the channels below."
      content={
        <div className="grid lg:grid-cols-3 gap-8">
           <ContactCard icon={Mail} title="Email" value="hello@jeebha.com" />
           <ContactCard icon={Phone} title="Phone" value="+213 550 00 00 00" />
           <ContactCard icon={MapPin} title="Headquarters" value="Didouche Mourad, Algiers" />
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
