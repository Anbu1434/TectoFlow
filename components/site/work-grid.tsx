'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects as defaultProjects, projectCategories, type ProjectCategory } from '@/lib/projects';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

function ProjectCard({ project, index }: { project: any; index: number }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Track scroll progress of this specific card container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Create subtle parallax translation and scaling for the cover image
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.03, 1, 1.03]);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col gap-8 py-16 md:py-24 lg:flex-row lg:items-center lg:gap-16 border-b border-border/40 last:border-b-0',
        index === 0 && 'pt-0 md:pt-0',
        !isEven && 'lg:flex-row-reverse'
      )}
    >
      {/* Image Container with Parallax Zoom */}
      <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl border border-border bg-card aspect-[4/3] relative group">
        <Link href={`/work/${project.slug}`} className="block w-full h-full relative overflow-hidden">
          <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-full">
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={index < 2}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-60" />
          <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-background/95 text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 shadow-md">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </Link>
      </div>

      {/* Details Container with viewport-triggered staggered slides */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors">
            {project.category}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground">
            {project.client} · {project.year}
          </span>
        </div>

        <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-foreground hover:text-accent transition-colors duration-300">
          <Link href={`/work/${project.slug}`}>{project.title}</Link>
        </h3>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed text-pretty">
          {project.excerpt}
        </p>

        {/* Dynamic Project Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/40 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>


      </motion.div>
    </div>
  );
}

export function WorkGrid({ projects = defaultProjects }: { projects?: any[] }) {
  const [filter, setFilter] = React.useState<'All' | ProjectCategory>('All');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const filtered = React.useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  return (
    <div className="flex flex-col gap-10">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-orange-500 to-amber-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Sticky Filter bar */}
      <div className="sticky top-16 md:top-24 z-30 py-4 -mx-4 px-4 bg-gradient-to-b from-background via-background to-transparent pointer-events-none">
        <div className="max-w-max mx-auto flex items-center gap-1 rounded-full border border-border/40 bg-background/70 backdrop-blur-md px-2 py-1.5 shadow-lg shadow-black/5 dark:shadow-black/20 pointer-events-auto">
          {projectCategories.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 md:text-sm',
                  isActive
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-accent rounded-full -z-10 shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
