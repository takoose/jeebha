import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Users, Star, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const jobs = [
  { id: 1, title: 'Operations Manager', area: 'Logistics', location: 'Algiers, DZ', type: 'Full-time' },
  { id: 2, title: 'Senior Backend Engineer', area: 'Tech', location: 'Remote / Sétif', type: 'Full-time' },
  { id: 3, title: 'Customer Success lead', area: 'Operations', location: 'Oran, DZ', type: 'Full-time' },
  { id: 4, title: 'Supply Chain Coordinator', area: 'Logistics', location: 'Constantine, DZ', type: 'Full-time' },
  { id: 5, title: 'UI/UX Designer', area: 'Product', location: 'Remote', type: 'Contract' },
];

export default function Careers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-navy font-sans">
      {/* Hero */}
      <section className="bg-navy pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/img/careers_hero.png')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-yellow text-navy px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4">
              Join the construction revolution
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
              Building the <br/> <span className="text-yellow">future</span> of Africa.
            </h1>
            <p className="text-slate-400 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
              We're looking for builders, thinkers, and doers to help us digitize the largest industry in the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-4xl font-black text-navy mb-1 italic">1200+</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Members</p>
          </div>
          <div>
            <p className="text-4xl font-black text-navy mb-1 italic">15+</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offices</p>
          </div>
          <div>
            <p className="text-4xl font-black text-navy mb-1 italic">4</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Major Clusters</p>
          </div>
          <div>
            <p className="text-4xl font-black text-navy mb-1 italic">$50M+</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raised to build</p>
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-32 px-6" id="openings">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Open Positions</h2>
              <p className="text-slate-500 font-medium">Browse our current openings and find your fit.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search jobs..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-yellow"
              />
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                whileHover={{ x: 10, backgroundColor: '#f8fafc' }}
                className="p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer group transition-all"
              >
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="bg-navy/5 text-navy px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{job.area}</span>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{job.type}</span>
                  </div>
                  <h3 className="text-2xl font-black group-hover:text-yellow transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  </div>
                </div>
                <button className="bg-navy text-white p-4 rounded-2xl group-hover:bg-yellow group-hover:text-navy transition-all">
                  <ArrowUpRight size={24} />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-white rounded-[3rem] text-center border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <img src="/img/team_photo.png" className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none" alt="Team" />
            <Users size={40} className="mx-auto mb-6 text-yellow" />
            <h4 className="text-xl font-black mb-4 uppercase tracking-tight">Not seeing the right fit?</h4>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-8">Send us your CV anyway, we're always looking for talents</p>
            <button className="text-navy font-black text-xs uppercase tracking-widest hover:underline decoration-yellow decoration-4">talent@jeebha.com</button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-yellow py-32 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black text-navy tracking-tighter mb-12">
          Ready to <br/> build something <br/> <span className="italic">massive?</span>
        </h2>
        <button className="bg-navy text-white px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-navy/20 hover:scale-105 transition-all">
          Apply Now
        </button>
      </section>
    </div>
  );
}
