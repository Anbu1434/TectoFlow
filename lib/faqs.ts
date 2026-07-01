export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: 'How do you price your work?',
    answer:
      'Most engagements are fixed-scope projects with a clear price upfront. For ongoing partnerships, we offer monthly subscriptions. We don\'t bill hourly — you\'re paying for outcomes, not time. Every proposal includes a detailed scope, timeline, and fixed price before any work starts.',
  },
  {
    question: 'What\'s a typical project timeline?',
    answer:
      'A brand identity runs 4–6 weeks. A full marketing site takes 6–10 weeks depending on scope. Product design engagements are usually 8–12 weeks. The Launch Sprint compresses brand and a landing page into 4 weeks. We\'ll give you a realistic timeline in your proposal — and we hit it.',
  },
  {
    question: 'Do you work with early-stage startups?',
    answer:
      'Yes. About a third of our clients are pre-Series A. We\'ve designed brands and sites for companies at their incorporation, through their seed round, and into Series B and beyond. The Launch Sprint was built specifically for teams preparing to raise.',
  },
  {
    question: 'Can you work with our existing engineering team?',
    answer:
      'Absolutely. We build in the same tools your team uses — Figma, Linear, GitHub, Slack — and hand off clean, documented code. Many of our product design engagements are co-development, where we design and your engineers build, or vice versa.',
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer:
      'Yes. We offer a monthly Growth Design subscription for teams that need a senior designer on retainer, and we provide a 30-day post-launch support window on all fixed-scope projects. We\'re also available for follow-up engagements — most of our clients come back.',
  },
  {
    question: 'What\'s your process for the first call?',
    answer:
      'The first call is 30 minutes, no slides, no pitch. We want to understand your goals, timeline, and budget. If we\'re a fit, we send a proposal within a week. If we\'re not, we\'ll tell you and recommend someone who is.',
  },
];
