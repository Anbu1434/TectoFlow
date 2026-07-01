'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Dribbble, ArrowRight } from 'lucide-react';
import { siteConfig as defaultSiteConfig } from '@/lib/site';

const studioLinks = [
  { label: 'WORK', href: '/work' },
  { label: 'SERVICES', href: '/#services' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/#contact' },
];

export function Footer({ siteConfig = defaultSiteConfig }: { siteConfig?: any }) {
  const [email, setEmail] = React.useState('');
  const [website, setWebsite] = React.useState(''); // Honeypot state
  const [status, setStatus] = React.useState<'idle' | 'done'>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const socialLinks = [
    { label: 'TWITTER', href: siteConfig.social?.twitter, icon: Twitter },
    { label: 'LINKEDIN', href: siteConfig.social?.linkedin, icon: Linkedin },
    { label: 'DRIBBBLE', href: siteConfig.social?.dribbble, icon: Dribbble },
    { label: 'INSTAGRAM', href: siteConfig.social?.instagram, icon: Instagram },
  ].filter(link => link.href);

  const contactLinks = [
    { label: 'EMAIL', href: `mailto:${siteConfig.email}`, display: (siteConfig.email || '').toLowerCase() },
    { label: 'PHONE', href: `tel:${siteConfig.phone}`, display: (siteConfig.phone || '').toUpperCase() },
  ];

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('done');
      setEmail('');
      setWebsite('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="w-full bg-background px-4 pb-4 md:px-8 md:pb-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-zinc-950 text-zinc-100 pt-16 md:pt-24 pb-0">
        
        {/* Main Grid */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          
          {/* Left Side: Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            
            {/* Studio Column */}
            <div className="flex flex-col gap-4">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
                STUDIO
              </span>
              <ul className="flex flex-col gap-3">
                {studioLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials Column */}
            <div className="flex flex-col gap-4">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
                SOCIALS
              </span>
              <ul className="flex flex-col gap-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
                CONTACT
              </span>
              <ul className="flex flex-col gap-3">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors duration-200 block truncate max-w-full"
                      title={link.display}
                    >
                      {link.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Side: Newsletter Signup */}
          <div className="flex flex-col gap-4 lg:items-end">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
              NEWSLETTER SIGNUP
            </span>
            {status === 'done' ? (
              <p className="text-sm font-semibold text-accent lg:text-right mt-2">
                THANKS — YOU&apos;RE ON THE LIST.
              </p>
            ) : (
              <div className="w-full max-w-md">
                <form onSubmit={onSubscribe} className="relative mt-2 w-full">
                  {/* Honeypot field (visually and keyboard hidden to trap automated spam bots) */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none"
                  />
                  <input
                    type="email"
                    required
                    disabled={submitting}
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-6 pr-14 rounded-full border border-zinc-800 bg-white text-black placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent font-medium text-sm disabled:opacity-70"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white hover:bg-accent hover:text-accent-foreground transition-colors duration-200 disabled:opacity-50"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                {errorMsg && (
                  <p className="text-xs text-red-500 mt-2 font-semibold lg:text-right">
                    {errorMsg}
                  </p>
                )}
              </div>
            )}
            
            {/* Social Icons matching the reference style */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-accent hover:text-white transition-colors duration-200"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright Notice */}
        <div className="mt-16 text-center text-xs font-semibold tracking-wider text-zinc-500">
          &copy; {new Date().getFullYear()} {(siteConfig.name || 'TECTOFLOW').toUpperCase()}
        </div>

        {/* Circular Rotating Stamp Badge */}
        <div className="relative flex items-center justify-center my-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-28 h-28 text-accent/80"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path
                id="circlePath"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="transparent"
              />
              <text className="text-[7.2px] font-bold tracking-[0.22em]">
                <textPath href="#circlePath">
                  {(siteConfig.name || 'TECTOFLOW').toUpperCase()} STUDIO • CRAFTED WITH CARE •
                </textPath>
              </text>
            </svg>
          </motion.div>
          <div className="absolute flex items-center justify-center w-11 h-11 rounded-full bg-white text-accent font-display font-extrabold text-base shadow-sm overflow-hidden">
            {siteConfig.logoUrl ? (
              <Image
                src={siteConfig.logoUrl}
                alt={siteConfig.name || 'Logo'}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            ) : (
              (siteConfig.name || 'T')[0]
            )}
          </div>
        </div>

        {/* Giant brand name at bottom */}
        <div className="mt-6 text-center select-none overflow-hidden">
          <h2 className="font-display text-[15vw] font-black leading-[0.72] tracking-tighter text-white/95 uppercase">
            {siteConfig.name || 'TECTOFLOW'}
          </h2>
        </div>

      </div>
    </footer>
  );
}
