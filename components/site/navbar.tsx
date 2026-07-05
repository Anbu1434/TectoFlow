'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { siteConfig as defaultSiteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/site/theme-toggle';

export function Navbar({ siteConfig = defaultSiteConfig }: { siteConfig?: any }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Focus trap & Escape key handler for mobile overlay menu
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const container = overlayRef.current;
      if (!container) return;

      const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
      const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelectors);
      
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleFocusTrap);

    // Initial focus on the first link inside menu
    setTimeout(() => {
      const firstLink = overlayRef.current?.querySelector('a, button');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleFocusTrap);
    };
  }, [open]);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-transparent px-4 py-4 md:py-5">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'mx-auto flex h-[60px] max-w-6xl items-center justify-between rounded-full border border-border/40 bg-background/60 backdrop-blur-xl px-4 py-2 transition-all duration-300 md:h-[76px] md:px-6',
            scrolled
              ? 'border-border/80 bg-background/80 shadow-lg shadow-black/5 dark:shadow-black/20'
              : 'shadow-sm'
          )}
        >
          <Link
            href="/"
            onClick={() => {
              setOpen(false);
              document.body.style.overflow = 'unset';
            }}
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
            aria-label={`${siteConfig.name} home`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              {siteConfig.logoUrl ? (
                <div className="relative h-8 w-8 md:h-10 md:w-10">
                  <Image
                    src={siteConfig.logoUrl}
                    alt={siteConfig.name}
                    fill
                    sizes="(max-width: 768px) 32px, 40px"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-accent text-accent-foreground shadow-sm md:h-10 md:w-10">
                  <span className="relative z-10 text-sm font-bold md:text-base">
                    {(siteConfig.name || 'T')[0]}
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-white/30 to-accent/0"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: 'linear',
                    }}
                  />
                </span>
              )}
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {siteConfig.nav.map((item: any, index: number) => {
              const active =
                pathname === item.href ||
                (pathname?.startsWith(`${item.href}/`) ?? false);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    'relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200',
                    active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {/* Active Indicator */}
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover Indicator (slides smoothly from item to item) */}
                  {hoveredIndex === index && !active && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-muted/80"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="hidden rounded-full md:inline-flex"
            >
              <Link href="/#contact" className="gap-1 group">
                Start a project <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-background/50 text-foreground transition-transform duration-200 active:scale-95 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Navigation Fullscreen Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col justify-between px-6 py-24 sm:px-12">
              <nav className="flex flex-col gap-6" aria-label="Mobile Navigation">
                {siteConfig.nav.map((item: any, index: number) => {
                  const active =
                    pathname === item.href ||
                    (pathname?.startsWith(`${item.href}/`) ?? false);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -10, opacity: 0 }}
                      transition={{ delay: index * 0.08, type: 'spring', stiffness: 150 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          setOpen(false);
                          document.body.style.overflow = 'unset';
                        }}
                        className={cn(
                          'inline-flex items-center gap-2 text-3xl font-bold tracking-tight transition-colors duration-200 font-display',
                          active ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {item.label}
                        {active && <motion.span layoutId="mobile-active-dot" className="h-2 w-2 rounded-full bg-accent" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col gap-6"
              >
                <div className="h-px bg-border/60" />
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Get in Touch
                  </span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </div>

                <Button asChild size="lg" className="w-full rounded-full">
                  <Link
                    href="/#contact"
                    onClick={() => {
                      setOpen(false);
                      document.body.style.overflow = 'unset';
                    }}
                    className="gap-2 group"
                  >
                    Start a project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
