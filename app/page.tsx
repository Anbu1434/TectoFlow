import { Hero } from '@/components/site/hero';
import { ServicesOverview } from '@/components/site/services-overview';
import { FeaturedWork } from '@/components/site/featured-work';
import { Process } from '@/components/site/process';
import { FaqSection } from '@/components/site/faq-section';
import { ContactSection } from '@/components/site/contact-section';
import dynamic from 'next/dynamic';
import { 
  getSiteConfig, 
  getServices, 
  getProjects, 
  getProcessSteps, 
  getStats, 
  getTestimonials,
  getFAQs
} from '@/lib/db';

const Stats = dynamic(() => import('@/components/site/stats'));
const Testimonials = dynamic(() => import('@/components/site/testimonials'));




export default async function HomePage() {
  const [config, services, allProjects, processSteps, stats, testimonials, faqs] = await Promise.all([
    getSiteConfig(),
    getServices(),
    getProjects(),
    getProcessSteps(),
    getStats(),
    getTestimonials(),
    getFAQs(),
  ]);
  const featuredProjects = allProjects.filter((p: any) => p.featured);

  return (
    <>
      <Hero siteConfig={config} />
      <ServicesOverview services={services} />
      <FeaturedWork projects={featuredProjects} />
      <Process steps={processSteps} />
      <Stats stats={stats} />
      <Testimonials testimonials={testimonials} />
      <FaqSection faqs={faqs} />
      <ContactSection />
    </>
  );
}
