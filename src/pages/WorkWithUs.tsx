import { motion } from 'motion/react';
import { Truck, HardHat, DollarSign, Clock, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

export default function WorkWithUs() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-navy font-sans">
      {/* Hero */}
      <section className="bg-navy pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grayscale opacity-20 bg-[url('/img/team_photo.png')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
              {t('work.title')}
            </h1>
            <p className="text-slate-400 font-medium text-xl leading-relaxed">
              {t('work.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pathways */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Driver Path */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-8">
                <Truck size={32} />
              </div>
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">{t('work.become_driver')}</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                {t('work.driver_desc')}
              </p>
              
              <div className="space-y-6 mb-12">
                <Benefit item={t('work.benefit_instant_p')} icon={DollarSign} />
                <Benefit item={t('work.benefit_flex_h')} icon={Clock} />
                <Benefit item={t('work.benefit_opt_r')} icon={Shield} />
              </div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-navy text-white font-black py-6 rounded-3xl uppercase tracking-widest text-xs hover:bg-yellow hover:text-navy transition-all shadow-xl shadow-navy/20"
            >
              {t('work.register_driver')}
            </button>
          </motion.div>

          {/* Builder Path */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mb-8">
                <HardHat size={32} />
              </div>
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">{t('work.join_builder')}</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                {t('work.builder_desc')}
              </p>
              
              <div className="space-y-6 mb-12">
                <Benefit item={t('work.benefit_verif_m')} icon={Shield} />
                <Benefit item={t('work.benefit_cost_t')} icon={DollarSign} />
                <Benefit item={t('work.benefit_sched_d')} icon={Clock} />
              </div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="w-full border-4 border-navy text-navy font-black py-6 rounded-3xl uppercase tracking-widest text-xs hover:bg-navy hover:text-white transition-all shadow-xl"
            >
              {t('work.signup_builder')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6 bg-navy text-white text-center">
        <h2 className="text-4xl font-black uppercase tracking-tight mb-20 text-center">{t('work.how_join')}</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          <Step 
            num="01" 
            title={t('work.step1_title')} 
            desc={t('work.step1_desc')} 
          />
          <Step 
            num="02" 
            title={t('work.step2_title')} 
            desc={t('work.step2_desc')} 
          />
          <Step 
            num="03" 
            title={t('work.step3_title')} 
            desc={t('work.step3_desc')} 
          />
        </div>
      </section>
    </div>
  );
}

function Benefit({ item, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4 text-navy">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
        <Icon size={18} className="text-yellow" />
      </div>
      <span className="font-bold text-sm uppercase tracking-widest">{item}</span>
    </div>
  );
}

function Step({ num, title, desc }: any) {
  return (
    <div className="space-y-6">
      <div className="text-6xl font-black text-white/10 italic leading-none">{num}</div>
      <h4 className="text-xl font-black uppercase tracking-tight text-yellow">{title}</h4>
      <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
