import { cn } from '@/lib/utils';
import { Container } from '@/components/site/container';
import { Reveal } from '@/components/site/reveal';

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn('pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32', className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <Reveal variant="blur" y={10} className="w-full">
      <div
        className={cn(
          'flex flex-col gap-4',
          align === 'center' && 'items-center text-center',
          className
        )}
      >
        {eyebrow && (
          <span className="text-sm font-medium uppercase tracking-widest text-accent inline-flex items-center gap-2">
            {typeof eyebrow === 'string' ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span>{eyebrow}</span>
              </>
            ) : (
              eyebrow
            )}
          </span>
        )}
        <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-balance">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg text-pretty">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

