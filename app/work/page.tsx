import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/page-header';
import { WorkGrid } from '@/components/site/work-grid';
import { Section } from '@/components/site/section';
import { ContactSection } from '@/components/site/contact-section';
import { getProjects } from '@/lib/db';



export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected case studies from TectoFlow — branding, web, product, and motion work for ambitious technology companies.',
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title={
          <>
            Case studies,{' '}
            <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
              not just pretty pictures
            </span>
          </>
        }
        description="Every project here solved a real business problem. Filter by discipline to find work that looks like yours."
        hasBorder={false}
      />
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <WorkGrid projects={projects} />
      </Section>
      <ContactSection />
    </>
  );
}
