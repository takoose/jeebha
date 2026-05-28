import PageTemplate from '../components/PageTemplate';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

const articles = [
  {
    title: "Jeebha Expands to Algiers with New Logistics Partners",
    date: "May 15, 2026",
    category: "Expansion",
    desc: "We are excited to announce our formal expansion into the capital region, bringing over 500 new verified suppliers to the platform.",
    img: "/src/assets/images/logistics_truck_fleet_1779198715505.png"
  },
  {
    title: "Digital Transformation in North African Construction",
    date: "April 22, 2026",
    category: "Industry Insight",
    desc: "A deep dive into how mobile technology is reducing project delays by up to 30% for small and medium-scale builders.",
    img: "/src/assets/images/hero_construction_modern_1779198698216.png"
  },
  {
    title: "Sustainability: The Future of Materials",
    date: "April 05, 2026",
    category: "Sustainability",
    desc: "Jeebha partners with green cement producers to offer low-carbon alternatives in the materials marketplace.",
    img: "/src/assets/images/materials_marketplace_grid_1779198733974.png"
  }
];

export default function Newsroom() {
  return (
    <PageTemplate 
      title="Newsroom"
      subtitle="Latest updates, industry news, and press releases from the Jeebha team."
      heroImage="/src/assets/images/hero_construction_modern_1779198698216.png"
      content={
        <div className="space-y-12 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl group hover:shadow-2xl transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={article.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.title} />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-yellow text-navy px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{article.category}</span>
                    <div className="flex items-center gap-1 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                       <Calendar size={12} />
                       {article.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter mb-4 leading-tight group-hover:text-yellow transition-colors">{article.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">{article.desc}</p>
                  <button className="flex items-center gap-2 text-navy font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Read Story <ArrowRight size={14} className="text-yellow" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-navy rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
                <Newspaper size={48} className="text-yellow mx-auto mb-8" />
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Press Contact</h2>
                <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">Are you a journalist? Contact our media team for inquiries, assets, and interviews.</p>
                <a href="mailto:press@jeebha.com" className="text-yellow font-black text-xl hover:underline">press@jeebha.com</a>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px]"></div>
          </div>
        </div>
      }
    />
  );
}
