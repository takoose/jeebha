import PageTemplate from '../components/PageTemplate';
import { useTranslation } from '../context/LanguageContext';

export default function OurStory() {
  const { t } = useTranslation();
  return (
    <PageTemplate 
      title={t('story.title')}
      subtitle={t('story.subtitle')}
      heroImage="/img/team_photo.png"
      content={
        <div className="max-w-3xl space-y-8 text-lg text-slate-500 font-medium leading-relaxed">
           <p>
              {t('story.p1')}
           </p>
           <p>
              {t('story.p2')}
           </p>
        </div>
      }
    />
  );
}
