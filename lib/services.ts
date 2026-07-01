import {
  Palette,
  MonitorSmartphone,
  Rocket,
  LineChart,
  Sparkles,
  Code2,
  type LucideIcon,
} from 'lucide-react';

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  deliverables: string[];
  startingPrice: string;
};

export const services: Service[] = [
  {
    slug: 'brand-strategy',
    title: 'Brand Strategy',
    short: 'Positioning, messaging, and identity systems that make tech companies impossible to ignore.',
    description:
      'We dig into your market, audience, and ambition to build a brand platform that holds up under scale. From positioning workshops to verbal and visual identity systems, we give you the foundation to move fast without losing yourself.',
    icon: Palette,
    deliverables: [
      'Positioning & messaging framework',
      'Brand voice & tone guidelines',
      'Visual identity system (logo, color, type)',
      'Brand guidelines playbook',
    ],
    startingPrice: '$18k',
  },
  {
    slug: 'web-design',
    title: 'Web Design & Build',
    short: 'High-conversion marketing sites and product pages engineered for speed and clarity.',
    description:
      'Marketing sites that earn their budget. We design and build in tight loops — research, wireframes, high-fidelity design, and production code — so your site launches fast and ranks well. Every page is built to convert and easy for your team to update.',
    icon: MonitorSmartphone,
    deliverables: [
      'UX research & information architecture',
      'High-fidelity Figma design system',
      'Responsive Next.js build',
      'CMS integration & analytics setup',
    ],
    startingPrice: '$32k',
  },
  {
    slug: 'product-design',
    title: 'Product Design',
    short: 'End-to-end product design for SaaS and developer tools — from zero to launch.',
    description:
      'We embed with your engineering team to design products people actually want to use. From onboarding flows to complex dashboards, we balance speed and craft so you can ship features that feel considered, not rushed.',
    icon: Code2,
    deliverables: [
      'User flows & journey mapping',
      'Component library & design tokens',
      'Interactive prototypes',
      'Design QA & handoff',
    ],
    startingPrice: '$45k',
  },
  {
    slug: 'launch-sprint',
    title: 'Launch Sprint',
    short: 'A focused 4-week sprint to ship a brand and landing page before your next funding round.',
    description:
      'When you need to move, we move. The Launch Sprint compresses our brand and web process into four focused weeks — strategy, identity, and a conversion-ready landing page built to make investors and early customers say yes.',
    icon: Rocket,
    deliverables: [
      '1-week strategy & positioning',
      '1-week identity design',
      '2-week landing page build',
      'Launch playbook & assets',
    ],
    startingPrice: '$24k',
  },
  {
    slug: 'growth-design',
    title: 'Growth Design',
    short: 'Ongoing design partnership for teams that ship constantly and need a senior eye.',
    description:
      'A monthly design subscription for funded teams. You get a dedicated senior designer embedded in your workflow — landing pages, experiments, lifecycle assets, and product polish — without the overhead of a full-time hire.',
    icon: LineChart,
    deliverables: [
      'Dedicated senior designer',
      'Weekly design sprints',
      'Experiment design & analysis',
      'Slack & Linear integration',
    ],
    startingPrice: '$12k/mo',
  },
  {
    slug: 'motion-brand',
    title: 'Motion & Brand Film',
    short: 'Brand films, product animations, and motion systems that make your story move.',
    description:
      'Static brands get forgotten. We build motion systems and brand films that translate your identity into movement — for launch teasers, product reveals, and the moments that need to land with feeling.',
    icon: Sparkles,
    deliverables: [
      'Motion principles & system',
      'Brand film (30–60s)',
      'Product animation suite',
      'Social cutdowns & templates',
    ],
    startingPrice: '$20k',
  },
];

export const serviceCategories = ['All', ...services.map((s) => s.title)];
