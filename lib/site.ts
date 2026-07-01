export const siteConfig = {
  name: 'TectoFlow',
  tagline: 'Branding & digital studio for ambitious tech',
  description:
    'TectoFlow is a branding and digital product studio building identities, websites, and products for ambitious technology companies.',
  url: 'https://tectoflow.studio',
  email: 'anbarasan0909@gmail.com',
  phone: '+1 (415) 555-0142',
  address: '535 Mission St, Suite 1400, San Francisco, CA 94105',
  social: {
    twitter: 'https://twitter.com/tectoflowstudio',
    instagram: 'https://instagram.com/tectoflowstudio',
    linkedin: 'https://linkedin.com/company/tectoflowstudio',
    dribbble: 'https://dribbble.com/tectoflowstudio',
  },
  nav: [
    { label: 'Services', href: '/#services' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/#contact' },
  ],
  heroTitle: 'We build web products that',
  heroDescription: 'We design and build websites, SaaS apps, and admin systems for teams that need reliability, speed, and measurable outcomes - from launch to long-term support.',
  heroWords: ['grow businesses', 'scale products', 'delight users', 'launch faster'],
  logoUrl: '',
  aboutHeaderEyebrow: 'About us',
  aboutHeaderTitle: 'Two people, one obsession',
  aboutHeaderDescription: 'We started TectoFlow in 2013 because we were tired of choosing between agencies that looked good and agencies that shipped. We built the studio we wanted to hire.',
  aboutStoryEyebrow: 'Our story',
  aboutStoryTitle: 'Built by makers, for makers',
  aboutStoryParagraphs: [
    "TectoFlow began in a cramped SoMa office with two designers, one engineer, and a shared frustration: the agencies we'd worked at cared more about their awards than their clients' outcomes. We wanted to build something different — a studio where craft and shipping weren't in tension.",
    "Twelve years later, we're still small by choice. Two people, no account managers, no layers between you and the people doing the work. We've shipped over 150 projects for startups and scale-ups, and our clients have raised more than $2 billion in funding with brands and products we helped build.",
    "We work with companies at every stage — from incorporation to Series C — but we're picky. We say no to about 80% of the projects that come our way, because we only take work we believe we can do better than anyone else. If we're not the right fit, we'll tell you who is."
  ],
} as const;

export type SiteConfig = typeof siteConfig;
