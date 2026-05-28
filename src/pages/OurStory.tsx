import PageTemplate from '../components/PageTemplate';

export default function OurStory() {
  return (
    <PageTemplate 
      title="Our Story"
      subtitle="Founded in 2024, Jeebha is on a mission to digitize the construction supply chain in Africa."
      heroImage="/img/team_photo.jpg"
      content={
        <div className="max-w-3xl space-y-8 text-lg text-slate-500 font-medium leading-relaxed">
           <p>
              Jeebha was born from a simple observation: the construction industry in North Africa is massive but fragmented. Contractors spend hours searching for materials, suppliers struggle with logistics, and transparency is rare.
           </p>
           <p>
              We decided to build the technology layer that connects everyone. A super-app where trust is built into the platform, and every delivery is a promise kept.
           </p>
        </div>
      }
    />
  );
}
