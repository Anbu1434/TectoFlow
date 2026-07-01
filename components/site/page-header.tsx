import { Reveal } from '@/components/site/reveal';
import { Container } from '@/components/site/container';
import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  hasBorder = true,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  hasBorder?: boolean;
}) {
  return (
    <section className={cn('relative overflow-hidden grain', hasBorder && 'border-b border-border', className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-dark dark:opacity-100 opacity-50" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/0 via-background/30 to-background" />
      <Container className={cn('pt-28 sm:pt-36 lg:pt-44', hasBorder ? 'pb-20 sm:pb-28 lg:pb-32' : 'pb-4 sm:pb-6 lg:pb-8')}>
        <Reveal>
          {eyebrow && (
            <span className="text-sm font-medium uppercase tracking-widest text-accent inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>{eyebrow}</span>
            </span>
          )}
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl text-pretty">
              {description}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
