import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getFeaturedProjects as defaultGetFeaturedProjects } from '@/lib/projects';
import { Section, SectionHeader } from '@/components/site/section';
import { Reveal } from '@/components/site/reveal';
import { Badge } from '@/components/ui/badge';
import { TiltCard } from '@/components/site/motion-components';

export function FeaturedWork({ projects = defaultGetFeaturedProjects() }: { projects?: any[] }) {

  return (
    <Section id="work" className="bg-card/20">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Selected work"
            title={
              <>
                Work we&apos;re{' '}
                <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  proud to sign
                </span>
              </>
            }
            description="A few recent projects. Each one started with a problem worth solving."
          />
          <Link
            href="/work"
            className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all work
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.1}>
              <TiltCard className="h-full rounded-2xl">
                <Link
                  href={`/work/${project.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card h-full transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                        {project.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
                      {project.excerpt}
                    </p>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
