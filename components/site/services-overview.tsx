import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services as defaultServices } from '@/lib/services';
import { Section, SectionHeader } from '@/components/site/section';
import { StaggerGroup, StaggerItem } from '@/components/site/reveal';
import { cn, getLucideIcon } from '@/lib/utils';
import { TiltCard } from '@/components/site/motion-components';

export function ServicesOverview({ services = defaultServices }: { services?: any[] }) {
  return (
    <Section id="services">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Capabilities"
            title={
              <>
                Our capabilities &{' '}
                <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  how we help you win
                </span>
              </>
            }
            description="We partner with ambitious technology brands to build high performance products, design strategic brand systems, and engineer clean production-ready code end-to-end craft with zero compromise."
          />
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 dark:bg-card/45 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-card hover:text-foreground hover:shadow-md shrink-0"
          >
            <span>Start a project</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </Link>
        </div>

        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const IconComponent = typeof service.icon === 'string' ? getLucideIcon(service.icon) : service.icon;

            return (
              <StaggerItem key={service.slug}>
                <TiltCard className="h-full rounded-2xl">
                  <div
                    className={cn(
                      'group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300',
                      'hover:border-accent/40 hover:bg-card/60 hover:shadow-xl hover:shadow-accent/5'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-xl font-semibold tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground text-pretty">
                        {service.short}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </Section>
  );
}
