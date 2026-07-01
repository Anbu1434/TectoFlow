import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Please enter your name')
    .max(80, 'That name is a bit long'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().max(100).optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  message: z
    .string()
    .min(20, 'Tell us a bit more — at least 20 characters')
    .max(2000, 'That\'s a lot — keep it under 2000 characters'),
  website: z.string().optional(), // Honeypot field to prevent spam bots
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const budgetRanges = [
  '< $10k',
  '$10k – $25k',
  '$25k – $50k',
  '$50k – $100k',
  '$100k+',
];

export const projectTypes = [
  'Brand Strategy',
  'Web Design & Build',
  'Product Design',
  'Launch Sprint',
  'Growth Design',
  'Motion & Brand Film',
  'Not sure yet',
];

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  website: z.string().optional(), // Honeypot field to prevent spam bots
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

