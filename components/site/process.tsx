import { processSteps as defaultProcessSteps } from '@/lib/content';
import { Section, SectionHeader } from '@/components/site/section';
import { StaggerGroup, StaggerItem } from '@/components/site/reveal';
import { getLucideIcon } from '@/lib/utils';

export function Process({ steps = defaultProcessSteps }: { steps?: any[] }) {
  return (
    <Section id="process">
      <div className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="How we work"
          title={
            <>
              A process built for{' '}
              <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                momentum
              </span>
            </>
          }
          description="Four phases, no black boxes. You always know what we're doing, why we're doing it, and what comes next."
          align="center"
          className="mx-auto items-center"
        />

        <div className="relative">
          {/* Vertical connecting line (mobile/tablet) */}
          <div className="absolute left-6 sm:left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent/40 via-border to-accent/40 lg:hidden" />

          {/* Horizontal connecting line (desktop) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-px bg-border lg:block" />

          <StaggerGroup className="flex flex-col gap-8 lg:grid lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const IconComponent = typeof step.icon === 'string' ? getLucideIcon(step.icon) : step.icon;

              return (
                <StaggerItem key={step.number} className="relative flex gap-5 sm:gap-6 lg:flex-col lg:items-center lg:gap-4 lg:text-center">
                  <div className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 lg:h-24 lg:w-24 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-md">
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-accent" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent text-[10px] sm:text-xs font-bold text-accent-foreground lg:-right-1 lg:-top-1 lg:h-7 lg:w-7">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1 lg:pt-0 lg:items-center">
                    <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                      {step.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </Section>
  );
}
