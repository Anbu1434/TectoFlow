# TectoFlow — Agency Portfolio Website

A modern, high-performance branding & digital studio website built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion (scroll reveals, page transitions, carousels)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Fonts:** Space Grotesk (display) + Inter (body) via `next/font`
- **Theming:** next-themes (dark/light toggle, defaults to dark)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, client marquee, services, featured work, process, stats, testimonials, CTA |
| `/work` | Filterable portfolio grid (by category) |
| `/work/[slug]` | Case study template (problem → solution → results → gallery → testimonial → next project) |
| `/services` | Detailed service breakdown, pricing tiers, FAQ accordion |
| `/about` | Agency story, stats, values, team grid, awards |
| `/contact` | Validated contact form, direct info, booking link, map embed |

## Folder Structure

```
app/
  layout.tsx          # Root layout: fonts, theme provider, navbar, footer, page transitions
  page.tsx            # Homepage
  work/
    page.tsx          # Portfolio grid
    [slug]/page.tsx   # Case study template
  services/page.tsx   # Services + pricing + FAQ
  about/page.tsx      # Story + team + values + awards
  contact/page.tsx    # Contact form + map
  api/contact/route.ts # Placeholder API route (Resend-ready)
  sitemap.ts          # Dynamic sitemap
  robots.ts           # Robots.txt
  manifest.ts         # PWA manifest
  icon.svg            # Favicon
  globals.css         # Design tokens + base styles
  not-found.tsx       # 404 page

components/
  site/               # Project-specific components
    navbar.tsx, footer.tsx, hero.tsx, etc.
  ui/                 # shadcn/ui primitives (button, card, input, etc.)

lib/
  site.ts             # Site config (name, nav, social, contact)
  services.ts         # Services data
  projects.ts         # Case studies data
  content.ts          # Process, stats, testimonials, client logos
  team.ts             # Team members, values, awards
  faqs.ts             # FAQ entries
  contact-schema.ts   # Zod schema + form options
  utils.ts            # cn() helper

hooks/
  use-toast.ts        # Toast hook
```

## Customizing Content

All content lives in `/lib` as typed data files — no CMS required. Edit these to update the site:

### 1. Brand identity
- **Name, tagline, contact info, social links:** `lib/site.ts`
- **Colors:** `app/globals.css` (CSS variables in `:root` and `.dark`) and `tailwind.config.ts`
  - The accent color is `--accent` (currently orange `24 95% 53%`). Change the HSL value to rebrand.
- **Fonts:** `app/layout.tsx` — swap the `next/font` imports (currently Space Grotesk + Inter)
- **Logo:** The "N" mark in `components/site/navbar.tsx`, `components/site/footer.tsx`, and `app/icon.svg`

### 2. Services
Edit `lib/services.ts`. Each service has a slug, title, description, icon (from Lucide), deliverables, and starting price. Add the slug as an `id` anchor on the services page.

### 3. Case studies / work
Edit `lib/projects.ts`. Each project includes cover image, problem/solution/results, gallery, and testimonial. Images use Pexels stock URLs — replace with your own. Set `featured: true` to show on the homepage.

### 4. Team
Edit `lib/team.ts` — names, roles, bios, photos, and social links. Also edit `values` and `awards` arrays.

### 5. Testimonials & process
Edit `lib/content.ts` — testimonials carousel, process steps, stats, and client logos.

### 6. FAQ
Edit `lib/faqs.ts`.

## Wiring Up the Contact Form

The form validates client-side with Zod and posts to `/api/contact`. To enable email delivery:

1. Install Resend: `npm install resend`
2. Add `RESEND_API_KEY` to your environment variables
3. Uncomment the Resend code in `app/api/contact/route.ts`

## Deployment

The project is deployment-ready for Vercel. Push to a Git repo and import at vercel.com — no additional configuration needed.

```bash
npm run build   # production build
npm run dev     # local development (runs automatically)
```

## Notes

- All placeholder copy is written to sound like a real agency — replace with your own.
- Images are stock photos from Pexels (referenced by URL, not downloaded).
- The site defaults to dark mode with a light/dark toggle in the navbar.
- Page transitions use Framer Motion's `AnimatePresence` keyed on the pathname.
