'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  CheckCircle2,
  Headphones,
  PanelsTopLeft,
  SearchCheck,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { Container } from '@/components/site/container';
import { Button } from '@/components/ui/button';
import { Announcement, AnnouncementTag, AnnouncementTitle } from '@/components/ui/announcement';
import { siteConfig as defaultSiteConfig } from '@/lib/site';

const featureItems = [
  {
    label: 'Custom solutions',
    description: 'Tailored for your business outcomes.',
    icon: CheckCircle2,
  },
  {
    label: 'SEO optimized',
    description: 'Rank higher and load instantly.',
    icon: SearchCheck,
  },
  {
    label: 'Scalable architecture',
    description: 'Built to grow with your volume.',
    icon: Blocks,
  },
  {
    label: 'Ongoing support',
    description: 'Dedicated partner for your team.',
    icon: Headphones,
  },
];

export function Hero({ siteConfig = defaultSiteConfig }: { siteConfig?: any }) {
  const words = siteConfig.heroWords || ['grow businesses', 'scale products', 'delight users', 'launch faster'];
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const entrance: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.55, ease: 'easeOut' },
    },
  };

  return (
    <header
      className="relative overflow-hidden bg-background pb-12 pt-36 sm:pb-16 sm:pt-40 lg:pb-20 lg:pt-48"
      role="banner"
      aria-labelledby="site-hero-title"
    >
      {/* Grid and Dot Pattern Backgrounds */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#8080800b_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Background ambient glow orbs with subtle framer-motion floating effect */}
      <motion.div 
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-accent/12 to-orange-500/8 blur-[130px]"
        animate={reduce ? undefined : {
          scale: [1, 1.05, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ willChange: "transform, opacity" }}
      />
      <motion.div 
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-80 w-80 rounded-full bg-orange-400/5 blur-[100px]"
        animate={reduce ? undefined : {
          x: [0, 15, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ willChange: "transform, opacity" }}
      />
      <motion.div 
        className="pointer-events-none absolute right-1/4 bottom-1/3 -z-10 h-80 w-80 rounded-full bg-accent/5 blur-[100px]"
        animate={reduce ? undefined : {
          x: [0, -15, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ willChange: "transform, opacity" }}
      />      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          
          <motion.div
            variants={entrance}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Redesigned & Rewritten Tech Badge using Announcement component */}
            <motion.div
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <Announcement
                themed
                className="group mb-8 border-border/80 bg-background/60 dark:bg-card/45 p-1 pr-3.5 text-xs sm:text-sm font-medium tracking-wide text-foreground shadow-[0_4px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:shadow-[0_4px_20px_rgba(249,115,22,0.06)] cursor-default"
              >
                <AnnouncementTag className="bg-gradient-to-r from-orange-500 to-accent px-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-orange-500/20 shrink-0 flex h-6 items-center justify-center rounded-full ml-0">
                  Studio
                </AnnouncementTag>

                <AnnouncementTitle className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors duration-300 py-0">
                  <span className="font-medium">
                    <span className="inline sm:hidden">Design & Engineering Studio</span>
                    <span className="hidden sm:inline">Design & Engineering Studio for Category Leaders</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </AnnouncementTitle>
              </Announcement>
            </motion.div>

            <h1
              id="site-hero-title"
              className="font-display text-4xl font-extrabold tracking-tight leading-[1.1] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {siteConfig.heroTitle || 'We build web products that'}{' '}
              <span className="block min-h-[1.25em] sm:inline-block sm:min-h-0 text-center">
                <span className="relative inline-block overflow-hidden align-bottom">
                  {mounted ? (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={index}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent pr-1"
                      >
                        {words[index]}.
                      </motion.span>
                    </AnimatePresence>
                  ) : (
                    <span className="inline-block bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent pr-1">
                      {words[0]}.
                    </span>
                  )}
                </span>
              </span>
            </h1>

            <span className="sr-only">
              Premium web development and software services for businesses.
            </span>

            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
              {siteConfig.heroDescription || 'We design and build websites, SaaS apps, and admin systems for teams that need reliability, speed, and measurable outcomes.'}
            </p>

            {/* Premium Centered CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center w-full max-w-md">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative h-12 w-full overflow-hidden rounded-full bg-accent px-8 text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
                >
                  <Link href="/#contact" aria-label="Start your project - contact us" className="flex items-center justify-center gap-2">
                    <span className="font-semibold tracking-wide">Start Your Project</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group h-12 w-full rounded-full border-border/85 bg-background/50 backdrop-blur-sm px-8 transition-all duration-300 hover:bg-card hover:border-accent/40"
                >
                  <Link href="/work" aria-label="View our work" className="flex items-center justify-center gap-2">
                    <PanelsTopLeft className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" aria-hidden="true" />
                    <span className="font-medium group-hover:text-accent transition-colors duration-300">View Our Work</span>
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Interactive Feature Cards - Center Grid */}
            <div className="mt-20 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl pb-8">
              {featureItems.map(({ label, description, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="w-full"
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 dark:border-border/30 bg-white/40 dark:bg-black/20 p-6 text-left transition-all duration-300 hover:border-orange-500/30 hover:bg-white/60 dark:hover:bg-black/30 hover:shadow-xl hover:shadow-orange-500/[0.02]"
                  >
                    {/* Subtle top light highlight border on hover */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover background glow orb */}
                    <div className="absolute -right-10 -top-10 -z-10 h-28 w-28 rounded-full bg-orange-500/0 blur-xl transition-all duration-500 group-hover:bg-orange-500/5 group-hover:blur-2xl" />

                    <div className="flex flex-col gap-5">
                      {/* Icon wrapper with satisfying hover active gradient transition */}
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/85 bg-background/50 dark:bg-background/20 text-orange-500 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-accent group-hover:border-transparent group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(249,115,22,0.25)]">
                        <Icon className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-105" aria-hidden="true" />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-foreground text-base tracking-tight transition-colors duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                          {label}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </Container>
    </header>
  );
}