import { motion } from 'motion/react';
import { Store, TrendingUp, Users, Globe, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

export default function ShopRegistration() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-navy font-sans">
      {/* Hero */}
      <section className="bg-navy pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/img/shop_placeholder.png')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-yellow text-navy px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
              <Store size={14} /> {t('shop.solution')}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
              {t('shop.title')}
            </h1>
            <p className="text-slate-400 font-medium text-xl leading-relaxed">
              {t('shop.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
          <ValueCard 
            icon={TrendingUp} 
            title={t('shop.rev_title')} 
            desc={t('shop.rev_desc')} 
          />
          <ValueCard 
            icon={Users} 
            title={t('shop.cust_title')} 
            desc={t('shop.cust_desc')} 
          />
          <ValueCard 
            icon={Globe} 
            title={t('shop.dig_title')} 
            desc={t('shop.dig_desc')} 
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-5xl font-black tracking-tight leading-none uppercase">{t('shop.why_list')}</h2>
              
              <div className="grid gap-10">
                <FeatureRow 
                  title={t('shop.log_title')} 
                  desc={t('shop.log_desc')} 
                />
                <FeatureRow 
                  title={t('shop.pay_title')} 
                  desc={t('shop.pay_desc')} 
                />
                <FeatureRow 
                  title={t('shop.mkt_title')} 
                  desc={t('shop.mkt_desc')} 
                />
              </div>
            </div>
            
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100">
               <h3 className="text-3xl font-black mb-8 uppercase tracking-tight">{t('shop.ready_start')}</h3>
               <div className="space-y-6">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('shop.commission')}</p>
                      <p className="font-black text-2xl text-navy">5.0%</p>
                    </div>
                    <Check size={24} className="text-green-500" />
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('shop.listing_fee')}</p>
                      <p className="font-black text-2xl text-navy">Free</p>
                    </div>
                    <Check size={24} className="text-green-500" />
                 </div>
                 <button 
                  onClick={() => navigate('/login?flow=signup')}
                  className="w-full bg-navy text-white font-black py-6 rounded-3xl uppercase tracking-widest text-sm hover:bg-yellow hover:text-navy transition-all shadow-xl shadow-navy/20 mt-8"
                 >
                   {t('shop.register_now')}
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-24 px-6 text-center">
         <ShieldCheck size={48} className="mx-auto mb-8 text-yellow" />
         <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">{t('shop.trusted')}</h2>
         <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t('shop.join_net')}</p>
      </section>
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-12 rounded-[3.5rem] border border-slate-100 hover:border-yellow transition-all group">
      <div className="w-16 h-16 bg-slate-50 text-navy rounded-3xl flex items-center justify-center mb-8 group-hover:bg-yellow transition-colors">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureRow({ title, desc }: any) {
  return (
    <div className="flex gap-6">
      <div className="w-6 h-6 rounded-full bg-yellow shrink-0 mt-1 flex items-center justify-center">
        <Check size={14} className="text-navy" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-black uppercase tracking-tight">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
