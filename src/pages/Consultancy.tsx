import PageTemplate from '../components/PageTemplate';
import { Ruler, FileText, Lightbulb } from 'lucide-react';

export default function Consultancy() {
  return (
    <PageTemplate 
      title="Consultancy"
      subtitle="Expert guidance for your construction projects. From feasibility studies to technical optimization, our experts are here to help."
      heroImage="/img/team_photo.jpg"
      content={
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-12 bg-navy text-white rounded-[3rem]">
              <Lightbulb size={40} className="text-yellow mb-8" />
              <h3 className="text-3xl font-black mb-4">Technical Advice</h3>
              <p className="text-slate-400 font-medium">Get expert advice on material selection, structural integrity, and cost optimization.</p>
           </div>
           <div className="p-12 bg-slate-50 rounded-[3rem]">
              <FileText size={40} className="text-navy mb-8" />
              <h3 className="text-3xl font-black mb-4 text-navy">Project Audits</h3>
              <p className="text-slate-500 font-medium">Independent audits to ensure your project is meeting quality standards and timelines.</p>
           </div>
        </div>
      }
    />
  );
}
