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
           <EquipmentCard 
             title={t('machinery.excavators')} 
             price={`${t('machinery.from')} 15,000 DZD/${t('machinery.day')}`} 
             image="/img/excavator.png" // Replace with your exact filename
           />
           <EquipmentCard 
             title={t('machinery.mixers')} 
             price={`${t('machinery.from')} 8,000 DZD/${t('machinery.day')}`} 
             image="/img/mixer.png" // Replace with your exact filename
           />
           <EquipmentCard 
             title={t('machinery.cranes')} 
             price={`${t('machinery.from')} 25,000 DZD/${t('machinery.day')}`} 
             image="/img/crane.png" // Replace with your exact filename
           />
        </div>
      }
    />
  );
}

interface EquipmentCardProps {
  title: string;
  price: string;
  image: string;
}

function EquipmentCard({ title, price, image }: EquipmentCardProps) {
  return (
    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between">
       <div>
         {/* Image Container */}
         <div className="w-full aspect-square bg-slate-200 rounded-2xl mb-6 overflow-hidden">
           {image ? (
             <img 
               src={image} 
               alt={title} 
               className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400">
               No Image
             </div>
           )}
         </div>
         <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
       </div>
       <p className="text-yellow font-black text-sm uppercase tracking-widest mt-4">{price}</p>
    </div>
  );
}
