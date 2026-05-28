import { motion } from 'motion/react';
import { Truck, HardHat, DollarSign, Clock, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkWithUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-navy font-sans">
      {/* Hero */}
      <section className="bg-navy pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grayscale opacity-20 bg-[url('/src/img/team_photo.jpg')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
              Join the <br/> <span className="text-yellow italic">Jeebha Network.</span>
            </h1>
            <p className="text-slate-400 font-medium text-xl leading-relaxed">
              Whether you're a truck driver or a construction professional, our platform helps you find work and grow your income.
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
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Become a Driver</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                Own a truck? Start taking loads from our marketplace. We provide the customers, you provide the transport.
              </p>
              
              <div className="space-y-6 mb-12">
                <Benefit item="Instant Payments" icon={DollarSign} />
                <Benefit item="Flexible Hours" icon={Clock} />
                <Benefit item="Optimized Routes" icon={Shield} />
              </div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-navy text-white font-black py-6 rounded-3xl uppercase tracking-widest text-xs hover:bg-yellow hover:text-navy transition-all shadow-xl shadow-navy/20"
            >
              Register as Driver
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
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Join as Builder</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                Manage your construction site digitally. Get better prices for materials and track every delivery in real-time.
              </p>
              
              <div className="space-y-6 mb-12">
                <Benefit item="Verified Materials" icon={Shield} />
                <Benefit item="Cost Tracking" icon={DollarSign} />
                <Benefit item="Scheduled Deliveries" icon={Clock} />
              </div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="w-full border-4 border-navy text-navy font-black py-6 rounded-3xl uppercase tracking-widest text-xs hover:bg-navy hover:text-white transition-all shadow-xl"
            >
              Sign up as Builder
            </button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6 bg-navy text-white text-center">
        <h2 className="text-4xl font-black uppercase tracking-tight mb-20 text-center">How to Join</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          <Step 
            num="01" 
            title="Register" 
            desc="Create your account and upload required documents (License, Vehicle ID, or Site permits)." 
          />
          <Step 
            num="02" 
            title="Verification" 
            desc="Our team will review your profile within 24 hours to ensure quality across the network." 
          />
          <Step 
            num="03" 
            title="Start Earning" 
            desc="Browse the load board or place your first materials order instantly." 
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
