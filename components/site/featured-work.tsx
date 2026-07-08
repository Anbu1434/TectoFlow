import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getFeaturedProjects as defaultGetFeaturedProjects } from '@/lib/projects';
import { Section, SectionHeader } from '@/components/site/section';
import { Reveal } from '@/components/site/reveal';
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

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.1}>
              <TiltCard maxRotate={5} className="h-full rounded-2xl">
                <Link
                  href={`/work/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,box-shadow] duration-500 hover:border-accent/40 hover:shadow-[0_24px_60px_-24px_hsl(var(--accent)/0.4)]"
                >
                  {/* Media plate */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                    {/* Legibility scrim behind the meta only */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />

                    {/* Category + year */}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4 sm:p-5">
                      <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        {project.category}
                      </span>
                      <span className="font-display text-sm font-semibold tabular-nums text-white/85">
                        {project.year}
                      </span>
                    </div>

                    {/* Reveal arrow */}
                    <div className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg shadow-accent/30 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {project.client}
                    </span>
                    <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
