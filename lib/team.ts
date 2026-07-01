export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    dribbble?: string;
    whatsapp?: string;
    phone?: string;
  };
};

export const team: TeamMember[] = [
  {
    name: 'Elena Rossi',
    role: 'Founder & Creative Director',
    bio: 'Twelve years building brands for companies before they were famous. Previously design lead at two acquired startups.',
    image:
      'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600',
    social: {
      whatsapp: 'https://wa.me/1234567890',
      phone: 'tel:+1234567890',
    },
  },
  {
    name: 'Marcus Chen',
    role: 'Design Director',
    bio: 'Product designer turned systems thinker. Obsessed with design tokens and the space between design and engineering.',
    image:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    social: {
      whatsapp: 'https://wa.me/1234567891',
      phone: 'tel:+1234567891',
    },
  },
];


export type Value = {
  title: string;
  description: string;
};

export const values: Value[] = [
  {
    title: 'Craft over output',
    description:
      'We\'d rather ship one thing that lasts than ten things that fade. Every pixel and every line of code gets the same care.',
  },
  {
    title: 'Partners, not vendors',
    description:
      'We say no to work we don\'t believe in and yes to relationships that last beyond the project. Your win is our win.',
  },
  {
    title: 'Speed with substance',
    description:
      'Fast doesn\'t mean careless. We move quickly because we\'ve done the thinking — not because we skipped it.',
  },
  {
    title: 'Curiosity is the brief',
    description:
      'We ask better questions than we give answers. The best work starts with understanding, not assumptions.',
  },
];

export type Award = {
  year: string;
  title: string;
  organization: string;
};

export const awards: Award[] = [
  { year: '2025', title: 'Brand of the Year (Lumen)', organization: 'Awwwards' },
  { year: '2025', title: 'Site of the Day (Harbor)', organization: 'CSS Design Awards' },
  { year: '2024', title: 'Best Studio Identity', organization: 'Brand New' },
  { year: '2024', title: 'Design Team of the Year', organization: 'Fast Company' },
  { year: '2023', title: 'Site of the Year (Atlas)', organization: 'Awwwards' },
];
