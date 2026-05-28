import PageTemplate from '../components/PageTemplate';
import { ShoppingBag, Star, ShieldCheck } from 'lucide-react';

export default function MaterialsMarketplace() {
  return (
    <PageTemplate 
      title="Materials Marketplace"
      subtitle="The largest catalog of construction materials in North Africa. Verified suppliers, transparent pricing, and instant delivery."
      heroImage="/img/materials_showcase.jpg"
      content={
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={ShoppingBag}
            title="Full Catalog"
            desc="From cement and steel to finishings and sanitaryware, find everything you need."
          />
          <FeatureCard 
            icon={Star}
            title="Verified Quality"
            desc="Every supplier undergoes a rigorous verification process to ensure material quality."
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Safe Payments"
            desc="Escrow payments ensure your money is only released when the materials arrive."
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
