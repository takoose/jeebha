import PageTemplate from '../components/PageTemplate';
import { Settings, Hammer, Zap } from 'lucide-react';

export default function HireMachinery() {
  return (
    <PageTemplate 
      title="Hire Machinery"
      subtitle="Heavy equipment at your fingertips. From excavators to cranes, our fleet is ready to deploy to your site."
      heroImage="/src/img/logistics_fleet.jpg"
      content={
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <EquipmentCard title="Excavators" price="From 15,000 DZD/day" />
           <EquipmentCard title="Concrete Mixers" price="From 8,000 DZD/day" />
           <EquipmentCard title="Crane Trucks" price="From 25,000 DZD/day" />
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
