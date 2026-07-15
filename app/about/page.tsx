import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/page-header';
import { Section, SectionHeader } from '@/components/site/section';
import { Reveal } from '@/components/site/reveal';
import { TeamGrid } from '@/components/site/team-grid';
import { ContactSection } from '@/components/site/contact-section';
import { Container } from '@/components/site/container';
import { getStats, getTeam, getValues, getSiteConfig } from '@/lib/db';



export const metadata: Metadata = {
  title: 'About',
  description:
    "TectoFlow is a branding and digital studio in San Francisco. We're two people obsessed with craft, speed, and the work that lasts.",
};

export default async function AboutPage() {
  const [stats, values, teamMembers, config] = await Promise.all([
    getStats(),
    getValues(),
    getTeam(),
    getSiteConfig(),
  ]);

  const defaultParagraphs = [
    "TectoFlow began in a cramped SoMa office with two designers, one engineer, and a shared frustration: the agencies we'd worked at cared more about their awards than their clients' outcomes. We wanted to build something different — a studio where craft and shipping weren't in tension.",
    "Twelve years later, we're still small by choice. Two people, no account managers, no layers between you and the people doing the work. We've shipped over 150 projects for startups and scale-ups, and our clients have raised more than $2 billion in funding with brands and products we helped build.",
    "We work with companies at every stage — from incorporation to Series C — but we're picky. We say no to about 80% of the projects that come our way, because we only take work we believe we can do better than anyone else. If we're not the right fit, we'll tell you who is."
  ];

  const storyParagraphs = config.aboutStoryParagraphs || defaultParagraphs;

  return (
    <>
      <PageHeader
        eyebrow={config.aboutHeaderEyebrow || "About us"}
        title={
          <>
            {(config.aboutHeaderTitle || "Two people, one obsession").split(' ').map((word: string, i: number, arr: string[]) => {
              const isHighlight = i >= arr.length - 2;
              if (isHighlight) {
                return (
                  <span key={i} className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {word}{' '}
                  </span>
                );
              }
              return word + ' ';
            })}
          </>
        }
        description={config.aboutHeaderDescription || "We started TectoFlow in 2013 because we were tired of choosing between agencies that looked good and agencies that shipped. We built the studio we wanted to hire."}
      />

      {/* Story */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              eyebrow={config.aboutStoryEyebrow || "Our story"}
              title={
                <>
                  {(config.aboutStoryTitle || "Built by makers, for makers").split(' ').map((word: string, i: number, arr: string[]) => {
                    const isHighlight = i >= arr.length - 2;
                    if (isHighlight) {
                      return (
                        <span key={i} className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                          {word}{' '}
                        </span>
                      );
                    }
                    return word + ' ';
                  })}
                </>
              }
            />
          </div>
          <div className="flex flex-col gap-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            {storyParagraphs.map((para: string, idx: number) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <p>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats band */}
      <section className="border-y border-border bg-card/20">
        <Container className="py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat: any) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  {stat.value}
                </span>
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <Section>
        <div className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="What we believe"
            title={
              <>
                Four things we{' '}
                <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  don&apos;t compromise on
                </span>
              </>
            }
            align="center"
            className="mx-auto items-center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value: any, i: number) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                  <span className="font-display text-3xl font-bold text-accent/30">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section className="bg-card/20">
        <div className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="The team"
            title={
              <>
                The people{' '}
                <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  behind the work
                </span>
              </>
            }
            description="A small team of senior people who've been doing this for a long time. No juniors learning on your budget."
            align="center"
            className="mx-auto items-center"
          />
          <TeamGrid teamMembers={teamMembers as any} />
        </div>
      </Section>


      <ContactSection siteConfig={config} />
    </>
  );
}
