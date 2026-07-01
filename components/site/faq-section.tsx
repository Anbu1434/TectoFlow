import { faqs as defaultFaqs } from '@/lib/faqs';
import { Container } from '@/components/site/container';
import { Section, SectionHeader } from '@/components/site/section';
import { Reveal } from '@/components/site/reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqSection({ faqs = defaultFaqs }: { faqs?: any[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Section id="faqs" className="bg-card/10">
      <Container className="max-w-4xl">
        <Reveal className="mb-12">
          <SectionHeader
            eyebrow="FAQ"
            title={
              <>
                Frequently asked{' '}
                <span className="bg-gradient-to-r from-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  questions
                </span>
              </>
            }
            description="Have questions about how we work? Here are the answers to the most common things clients ask us."
            align="center"
            className="mx-auto items-center"
          />
        </Reveal>

        <Reveal delay={0.2}>
          <div className="rounded-3xl border border-border/80 bg-card/45 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-border/45 last:border-b-0"
                >
                  <AccordionTrigger className="text-left font-display text-base font-semibold py-5 text-foreground hover:text-accent transition-colors duration-200">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-5 pr-4 text-pretty">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
