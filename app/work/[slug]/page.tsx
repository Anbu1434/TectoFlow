import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Quote, ExternalLink } from 'lucide-react';
import { getProjects, getProjectBySlug } from '@/lib/db';
import { Container } from '@/components/site/container';
import { Section, SectionHeader } from '@/components/site/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';



export async function generateStaticParams() {
  const items = await getProjects();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: `${project.title} — TectoFlow`,
      description: project.excerpt,
      images: [{ url: project.cover, width: 1200, height: 750, alt: project.title }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <article className="min-h-screen bg-background">
      {/* Immersive Hero Backdrop */}
      <div className="relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[65vh] w-full overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 z-0">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            priority
            className="object-cover blur-[30px] scale-110 opacity-30 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-mesh-dark dark:opacity-100 opacity-60 pointer-events-none" />
        </div>

        <Container className="relative z-10 flex min-h-[inherit] flex-col pt-28 sm:pt-32 lg:pt-36 pb-32 sm:pb-44 lg:pb-52">
          <Reveal>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm font-semibold tracking-wide text-muted-foreground backdrop-blur-md transition-colors hover:border-accent/40 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to work
            </Link>
          </Reveal>
          <Reveal className="mt-auto">
            <div className="flex flex-wrap items-center gap-3 pt-10">
              <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
                {project.category}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground">
                {project.client} · {project.year}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] text-balance">
              {project.title.split(' ').map((word: string, i: number) => {
                const words = project.title.split(' ');
                const isHighlight = i >= words.length - 2;
                if (isHighlight) {
                  return (
                    <span key={i} className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </h1>
          </Reveal>
        </Container>
      </div>

      {/* Main Content Layout */}
      <Container className="relative -mt-16 sm:-mt-24 lg:-mt-28 z-20">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
          {/* Left Column: Cover Image & Case Study Details */}
          <div className="flex flex-col gap-12 sm:gap-16">
            {/* Primary Cover Image with subtle glow and zoom */}
            <Reveal>
              <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-500 hover:shadow-[0_12px_50px_rgba(249,115,22,0.15)]">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            </Reveal>

            {/* Bento Grid: Challenge & Solution */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Reveal>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card/50 p-6 sm:p-8 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-accent/30 hover:bg-card/70">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                    <span className="font-mono text-sm font-semibold">01</span>
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                    The Challenge
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-pretty">
                    {project.problem}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card/50 p-6 sm:p-8 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-accent/30 hover:bg-card/70">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="font-mono text-sm font-semibold">02</span>
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                    The Solution
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-pretty">
                    {project.solution}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Gallery Grid */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="flex flex-col gap-8">
                <SectionHeader
                  title={
                    <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                      Project Showcase
                    </span>
                  }
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  {project.gallery.map((img: string, i: number) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div
                        className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <Image
                          src={img}
                          alt={`${project.title} — screenshot ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* Client Testimonial */}
            {project.testimonial && (
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-accent/5 p-8 sm:p-10 shadow-lg">
                  <div className="absolute top-0 right-0 -z-10 translate-x-12 -translate-y-12 opacity-[0.03]">
                    <Quote className="h-64 w-64 text-accent" />
                  </div>
                  <Quote className="mb-6 h-8 w-8 text-accent/50" />
                  <blockquote className="font-display text-lg sm:text-xl font-medium leading-relaxed text-foreground text-pretty">
                    &ldquo;{project.testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-8 flex items-center gap-4">
                    <Image
                      src={project.testimonial.avatar}
                      alt={project.testimonial.author}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full border border-border/80 object-cover shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{project.testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{project.testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Right Column: Metadata Sidebar & Live Site CTA */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            {/* Quick Facts Glass Card */}
            <Reveal>
              <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card/65 p-6 backdrop-blur-md shadow-sm">
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Quick Facts
                </h3>

                <div className="flex flex-col gap-4 divide-y divide-border/40">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Client</span>
                    <span className="font-semibold text-foreground">{project.client}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-semibold text-foreground">{project.year}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-semibold text-foreground">{project.category}</span>
                  </div>
                  <div className="flex flex-col gap-2 py-3 text-sm">
                    <span className="text-muted-foreground">Services Provided</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.tags.map((tag: string) => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/40 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {project.liveUrl && (
                  <Button asChild size="lg" className="w-full rounded-2xl bg-gradient-to-r from-accent via-orange-500 to-amber-500 text-accent-foreground font-semibold hover:shadow-lg hover:shadow-accent/15 transition-all duration-300 group">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <span>Visit Live Site</span>
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </Button>
                )}
              </div>
            </Reveal>

            {/* Quick CTA */}
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/25 p-6 text-center">
                <h4 className="font-semibold text-foreground">Have a similar project?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Let&apos;s discuss how we can help you achieve similar performance gains.
                </p>
                <Button asChild variant="outline" className="rounded-xl w-full">
                  <Link href="/#contact">Start a project</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Cinematic Next Project Footer Link */}
      <section className="mt-12 sm:mt-16 border-t border-border/40">
        <Link href={`/work/${nextProject.slug}`} className="group relative block w-full overflow-hidden py-12 sm:py-20 lg:py-24">
          {/* Background next cover image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={nextProject.cover}
              alt={nextProject.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-20 group-hover:opacity-30 blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>

          <Container className="relative z-10">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-col gap-1.5 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Next Case Study
                </span>
                <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                  {nextProject.title}
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {nextProject.client} · {nextProject.year}
                </p>
              </div>
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground shadow-lg">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1.5" />
              </div>
            </div>
          </Container>
        </Link>
      </section>
    </article>
  );
}
