'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials as defaultTestimonials } from '@/lib/content';
import { Section, SectionHeader } from '@/components/site/section';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Testimonials({ testimonials = defaultTestimonials }: { testimonials?: any[] }) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  React.useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[index];

  return (
    <Section id="testimonials" className="bg-card/20">
      <div className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Kind words"
          title={
            <>
              What our{' '}
              <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                clients say
              </span>
            </>
          }
          align="center"
          className="mx-auto items-center"
        />

        <div className="relative mx-auto max-w-3xl">
          <Quote className="mx-auto mb-8 h-12 w-12 text-accent/30" />

          <div className="relative min-h-[280px] sm:min-h-[240px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-8 text-center"
              >
                <p className="font-display text-xl font-medium leading-relaxed tracking-tight sm:text-2xl text-balance">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src={current.avatar}
                    alt={current.author}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold">{current.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {current.role}, {current.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === index ? 'w-8 bg-accent' : 'w-2 bg-border'
                  )}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Testimonials;
