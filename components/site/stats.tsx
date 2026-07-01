'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { stats as defaultStats } from '@/lib/content';
import { Container } from '@/components/site/container';

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    // Extract numeric portion for animation, keep prefix/suffix
    const match = value.match(/([^\d]*)([\d,.]+)(.*)/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const hasDecimal = num.includes('.');
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted = hasDecimal
        ? current.toFixed(1)
        : Math.round(current).toLocaleString();
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

export function Stats({ stats = defaultStats }: { stats?: any[] }) {
  return (
    <section className="border-y border-border bg-accent text-accent-foreground">
      <Container className="py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <CountUp value={stat.value} />
              </span>
              <span className="text-sm font-medium uppercase tracking-wider opacity-80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Stats;
