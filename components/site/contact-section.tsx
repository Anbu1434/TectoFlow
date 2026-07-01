import { Mail, Phone, MapPin, Calendar, Twitter, Instagram, Linkedin, Dribbble } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { ContactForm } from '@/components/site/contact-form';
import { Reveal } from '@/components/site/reveal';
import { Container } from '@/components/site/container';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/site/section';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone}`,
  },
  {
    icon: MapPin,
    label: 'Studio',
    value: siteConfig.address,
  },
];

const socials = [
  { icon: Twitter, href: siteConfig.social.twitter, label: 'Twitter' },
  { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram' },
  { icon: Linkedin, href: siteConfig.social.linkedin, label: 'LinkedIn' },
  { icon: Dribbble, href: siteConfig.social.dribbble, label: 'Dribbble' },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border grain">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-dark dark:opacity-100 opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/0 via-background/20 to-background" />

      <Container className="py-24 sm:py-32">
        <Reveal className="mb-16">
          <SectionHeader
            eyebrow="Let's build"
            title={
              <>
                Let&apos;s build something{' '}
                <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  great together.
                </span>
              </>
            }
            description="Tell us about your company and what you're trying to achieve. We'll reply within two business days — no sales calls, no pressure."
            align="center"
            className="mx-auto items-center"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Form */}
          <Reveal delay={0.3}>
            <ContactForm />
          </Reveal>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            <Reveal delay={0.4}>
              <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold">
                  Direct contact
                </h3>
                <div className="flex flex-col gap-4">
                  {contactInfo.map((info) => {
                    const content = (
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <info.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {info.label}
                          </span>
                          <span className="text-sm font-medium">
                            {info.value}
                          </span>
                        </div>
                      </div>
                    );
                    return info.href ? (
                      <a
                        key={info.label}
                        href={info.href}
                        className="transition-opacity hover:opacity-80"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={info.label}>{content}</div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="flex flex-col gap-4 rounded-2xl border border-accent bg-accent p-6 text-accent-foreground">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <h3 className="font-display text-lg font-semibold">
                    Prefer to talk?
                  </h3>
                </div>
                <p className="text-sm text-accent-foreground/80">
                  Book a 30-minute intro call. No slides, no pitch — just a
                  conversation about whether we&apos;re a fit.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full rounded-full"
                >
                  <a
                    href="https://cal.id/tectoflow/client-consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a call
                  </a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Follow along
                </h3>
                <div className="flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
