import PageTemplate from '../components/PageTemplate';
import { Truck, MapPin, Clock } from 'lucide-react';

export default function SiteLogistics() {
  return (
    <PageTemplate 
      title="Site Logistics"
      subtitle="Optimize your site flow with Jeebha's intelligent logistics network. Track every load, manage your fleet, and reduce downtime."
      heroImage="/img/logistics_fleet.png"
      content={
        <div className="space-y-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-6">
                <h3 className="text-4xl font-black text-navy tracking-tight">Real-time Visibility</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Never wonder where your load is again. Our live tracking system gives you down-to-the-second visibility on all your deliveries.
                </p>
                <div className="flex gap-4 pt-4">
                   <div className="px-6 py-3 bg-slate-100 rounded-full font-bold text-navy text-sm">GPS Tracking</div>
                   <div className="px-6 py-3 bg-slate-100 rounded-full font-bold text-navy text-sm">ETA Prediction</div>
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
