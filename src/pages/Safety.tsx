import PageTemplate from '../components/PageTemplate';
import { ShieldCheck, Eye, Lock } from 'lucide-react';

export default function Safety() {
  return (
    <PageTemplate 
      title="Safety"
      subtitle="Your safety is our priority. From physical site safety to digital data security, we've got you covered."
      heroImage="/img/icon_safety.png"
      content={
        <div className="grid md:grid-cols-3 gap-8 text-center">
           <div className="p-10 space-y-6">
              <ShieldCheck size={48} className="text-yellow mx-auto" />
              <h3 className="text-2xl font-black text-navy uppercase italic">Verified Partners</h3>
              <p className="text-slate-500 font-medium">Every supplier and driver is manually verified by our team.</p>
           </div>
           <div className="p-10 space-y-6">
              <Eye size={48} className="text-yellow mx-auto" />
              <h3 className="text-2xl font-black text-navy uppercase italic">Real-time Monitoring</h3>
              <p className="text-slate-500 font-medium">All deliveries are tracked via GPS for your protection.</p>
           </div>
           <div className="p-10 space-y-6">
              <Lock size={48} className="text-yellow mx-auto" />
              <h3 className="text-2xl font-black text-navy uppercase italic">Secure Payments</h3>
              <p className="text-slate-500 font-medium">Industry-standard encryption for all financial transactions.</p>
           </div>
        </div>
      }
    />
  );
}
