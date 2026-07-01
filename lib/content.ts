import {
  Search,
  PenTool,
  Code2,
  Send,
  type LucideIcon,
} from 'lucide-react';

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We start with a deep dive — stakeholder interviews, market research, and a workshop to align on what success actually looks like. No assumptions, just questions.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Strategy becomes form. We explore directions in tight loops, sharing work early and often so you\'re never surprised by the final result.',
    icon: PenTool,
  },
  {
    number: '03',
    title: 'Develop',
    description:
      'Design meets production. We build in the same tools your team uses, with clean handoffs and code you can maintain long after we\'re gone.',
    icon: Code2,
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      'Launch is a beginning, not an end. We help you ship, measure, and iterate — then stay on call for the moments that matter.',
    icon: Send,
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const stats: Stat[] = [
  { value: '150+', label: 'Projects shipped' },
  { value: '98%', label: 'Client retention' },
  { value: '12', label: 'Years in business' },
  { value: '$2.4B', label: 'Funding raised by clients' },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      'TectoFlow is the rare studio that thinks like a partner, not a vendor. They challenged our assumptions and built something better than we knew to ask for.',
    author: 'Marcus Webb',
    role: 'CEO',
    company: 'Lumen',
    avatar:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    quote:
      'We\'ve worked with five agencies over the years. TectoFlow is the only one we\'d hire again without a second thought.',
    author: 'Aisha Patel',
    role: 'VP Product',
    company: 'Harbor',
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    quote:
      'They moved at startup speed with agency craft. Our brand went from "who?" to "oh, them" in six weeks.',
    author: 'Tom Becker',
    role: 'Founder',
    company: 'Pulse',
    avatar:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    quote:
      'The team understood our developer audience better than agencies that specialize in dev tools. Sharp, fast, and genuinely curious.',
    author: 'Lin Zhang',
    role: 'CTO',
    company: 'Atlas',
    avatar:
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

