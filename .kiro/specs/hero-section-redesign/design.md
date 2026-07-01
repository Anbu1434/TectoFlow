# Technical Design Document: Hero Section Redesign

## Overview

### Purpose

This design document outlines the technical implementation for redesigning the hero section of the TectoFlow agency website. The redesign shifts the messaging from creative agency branding ("We build brands that earn attention") to professional software development positioning, emphasizing technical capabilities and clear value communication.

### Goals

- **Clarity**: Communicate what TectoFlow builds within 3 seconds of page load
- **Credibility**: Establish trust through concrete indicators and visual demonstrations
- **Conversion**: Provide clear, actionable CTAs for visitor engagement
- **Consistency**: Maintain brand cohesion by using the existing design system
- **Performance**: Ensure fast load times and smooth animations
- **Accessibility**: Meet WCAG AA standards for all users

### Scope

**In Scope:**
- Complete redesign of the hero section component (`components/site/hero.tsx`)
- Two-column responsive layout with text content and visual showcase
- New headline, supporting paragraph, and messaging
- Trust indicators with quantifiable metrics or client avatars
- Visual showcase component representing software products
- Theme support for light and dark modes
- Animation system using Framer Motion
- Accessibility compliance (WCAG AA)

**Out of Scope:**
- Changes to other page sections (navbar, footer, services, etc.)
- Backend API modifications
- Content management system integration
- A/B testing infrastructure
- Analytics tracking implementation
- Performance monitoring setup beyond standard Next.js metrics


## Architecture

### Component Structure

The redesigned hero section follows a modular component architecture:

```
Hero (parent container)
├── Container (existing wrapper component)
│   ├── HeroContent (left column - text and CTAs)
│   │   ├── Badge/Tag (professional identifier)
│   │   ├── Headline (h1)
│   │   ├── SupportingText (paragraph)
│   │   ├── CTAGroup (buttons)
│   │   └── TrustIndicators (avatars/metrics)
│   └── VisualShowcase (right column - product demonstration)
│       ├── DashboardPreview (mock interface)
│       ├── BrowserWindow (mockup frame)
│       └── FloatingCards (optional animated elements)
```

### Layout System

The hero section uses CSS Grid for the two-column layout on desktop and stacks vertically on mobile:

```
Desktop (≥1024px):
┌─────────────────────────────────────┐
│  Container (max-w-7xl)              │
│  ┌───────────────┬─────────────────┐│
│  │ HeroContent   │ VisualShowcase  ││
│  │ (left column) │ (right column)  ││
│  │               │                 ││
│  └───────────────┴─────────────────┘│
└─────────────────────────────────────┘

Mobile (<1024px):
┌─────────────────┐
│  Container      │
│  ┌─────────────┐│
│  │ HeroContent ││
│  └─────────────┘│
│  ┌─────────────┐│
│  │ Visual      ││
│  │ Showcase    ││
│  └─────────────┘│
└─────────────────┘
```

### Responsive Breakpoints

- **Mobile**: < 640px (sm) - Stacked layout, vertical CTAs, 32px headline
- **Tablet**: 640px - 1023px (sm to lg) - Stacked layout, horizontal CTAs, 40px headline
- **Desktop**: ≥ 1024px (lg) - Two-column layout, horizontal CTAs, 48px+ headline
- **Large Desktop**: ≥ 1280px (xl) - Enhanced spacing, 56px+ headline


### Animation Architecture

The hero section uses a staggered animation system powered by Framer Motion:

1. **Initial State**: All elements start with `opacity: 0` and `y: 20px` offset
2. **Animation Sequence**: Elements animate in order with 0.1s stagger delay
   - Badge/Tag (0s delay)
   - Headline (0.1s delay)
   - Supporting Text (0.2s delay)
   - CTA Buttons (0.3s delay)
   - Trust Indicators (0.4s delay)
   - Visual Showcase (0.5s delay)
3. **Easing**: All animations use the existing curve `[0.22, 1, 0.36, 1]` (cubic-bezier)
4. **Duration**: 0.6-0.7s per element
5. **Reduced Motion**: Respects `prefers-reduced-motion` user preference

### Theme System

The design leverages the existing CSS variable system for theme support:

- **Light Mode**: Uses `--background`, `--foreground`, `--muted-foreground`, `--accent` light values
- **Dark Mode**: Automatically switches via Tailwind's `dark:` prefix classes
- **Visual Showcase Theming**: Uses `dark:bg-card` and `dark:border-border` for consistent appearance
- **Contrast Requirements**: All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)


## Components and Interfaces

### Hero Component (Main)

```typescript
// components/site/hero.tsx
'use client';

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps): JSX.Element
```

**Responsibilities:**
- Render the complete hero section
- Manage animation orchestration
- Apply responsive grid layout
- Integrate Container wrapper
- Coordinate HeroContent and VisualShowcase

**Dependencies:**
- `@/components/site/container` (Container)
- `@/components/ui/button` (Button)
- `framer-motion` (motion)
- `next/link` (Link)
- `next/image` (Image, if using optimized images)
- `lucide-react` (icons)


### Visual Showcase Component Options

**Option 1: Dashboard Preview (Recommended)**
A mockup of a software dashboard interface showing:
- Sidebar navigation
- Data visualization (charts/graphs)
- Table or list view
- Action buttons
- Status indicators

```typescript
interface DashboardPreviewProps {
  className?: string;
  animated?: boolean; // Enable subtle float/pulse effects
}
```

**Option 2: Browser Window Mockup**
A browser window frame containing:
- URL bar with domain
- Website/application preview
- Responsive design showcase
- Multiple viewport sizes

```typescript
interface BrowserMockupProps {
  url: string;
  title: string;
  children: React.ReactNode;
}
```

**Option 3: Floating UI Cards**
Multiple card components floating with parallax effect:
- Feature cards
- Metric cards
- Component previews
- Stacked with depth

```typescript
interface FloatingCardsProps {
  cards: Array<{
    title: string;
    content: string;
    icon?: React.ReactNode;
  }>;
}
```

**Design Decision:** Option 1 (Dashboard Preview) is recommended because it:
- Clearly demonstrates software/SaaS expertise
- Aligns with premium aesthetic (Linear, Vercel, Stripe)
- Can be implemented as SVG for performance
- Works well in both light and dark themes
- Provides visual interest without distraction


### Trust Indicators Component

```typescript
interface TrustIndicatorsProps {
  variant: 'avatars' | 'metrics' | 'logos';
  data?: {
    avatars?: string[]; // URLs to client/team avatars
    metrics?: {
      value: string | number;
      label: string;
    }[];
    logos?: string[]; // URLs to client logos
  };
}
```

**Implementation Variants:**

1. **Avatars with Text** (Currently Used - Enhanced Version)
   ```
   [Avatar1][Avatar2][Avatar3][Avatar4]
   "Trusted by 150+ founders and product teams"
   ```

2. **Quantifiable Metrics**
   ```
   50+ Projects Delivered | 5 Years Experience | 98% Client Satisfaction
   ```

3. **Client Logos**
   ```
   [ClientLogo1] [ClientLogo2] [ClientLogo3] [ClientLogo4]
   ```

**Design Decision:** Use the enhanced avatar variant with real client avatars (if available) or switch to quantifiable metrics to emphasize concrete achievements.


## Data Models

### Content Configuration

The hero section content should be easily configurable. While not implementing a CMS, the design supports future extraction to a content file:

```typescript
// types/hero-content.ts (future enhancement)
export interface HeroContent {
  badge: {
    text: string;
    show: boolean;
  };
  headline: {
    text: string;
    accent?: string; // Highlighted portion
  };
  supportingText: string;
  ctas: {
    primary: {
      text: string;
      href: string;
      icon?: string;
    };
    secondary: {
      text: string;
      href: string;
      icon?: string;
    };
  };
  trustIndicators: {
    variant: 'avatars' | 'metrics' | 'logos';
    data: TrustIndicatorData;
  };
  visualShowcase: {
    type: 'dashboard' | 'browser' | 'cards';
    animated: boolean;
  };
}
```

### Animation Configuration

```typescript
// types/animation-config.ts
export interface AnimationConfig {
  easing: number[]; // [0.22, 1, 0.36, 1]
  duration: number; // 0.6-0.7s
  staggerDelay: number; // 0.1s
  respectReducedMotion: boolean; // true
}

export const HERO_ANIMATION_CONFIG: AnimationConfig = {
  easing: [0.22, 1, 0.36, 1],
  duration: 0.7,
  staggerDelay: 0.1,
  respectReducedMotion: true,
};
```


### Responsive Configuration

```typescript
// types/responsive-config.ts
export interface ResponsiveConfig {
  breakpoints: {
    mobile: string;    // < 640px
    tablet: string;    // 640px - 1023px
    desktop: string;   // ≥ 1024px
    large: string;     // ≥ 1280px
  };
  layout: {
    mobile: 'stack';
    tablet: 'stack';
    desktop: 'two-column';
  };
  typography: {
    mobile: {
      headline: string; // text-3xl (32px)
      supporting: string; // text-base (16px)
    };
    tablet: {
      headline: string; // text-4xl (40px)
      supporting: string; // text-lg (18px)
    };
    desktop: {
      headline: string; // text-5xl/6xl (48-60px)
      supporting: string; // text-xl (20px)
    };
  };
}
```


## Error Handling

### Image Loading Failures

**Scenario**: Trust indicator avatars or visual showcase images fail to load

**Strategy**:
- Use Next.js Image component with built-in error handling
- Provide fallback placeholder images using data URIs or SVG
- Use `onError` handler to replace failed images with initials or icons
- Log errors to console in development mode

```typescript
<Image
  src={avatarUrl}
  alt={altText}
  width={40}
  height={40}
  onError={(e) => {
    console.error('Image load failed:', avatarUrl);
    e.currentTarget.src = '/fallback-avatar.svg';
  }}
/>
```

### Animation Performance Issues

**Scenario**: Animations cause janky performance on low-end devices

**Strategy**:
- Respect `prefers-reduced-motion` media query
- Use CSS `will-change` property sparingly
- Implement animation only on elements in viewport
- Fallback to CSS transitions if Framer Motion causes issues

```typescript
const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
>
```


### Theme Transition Issues

**Scenario**: Visual showcase has poor contrast or visibility during theme toggle

**Strategy**:
- Design visual showcase elements to work in both themes
- Use CSS variables that automatically adapt to theme
- Test contrast ratios in both light and dark modes
- Add subtle borders/shadows for definition in both themes

```css
/* Visual showcase container */
.showcase-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dark .showcase-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
}
```

### Missing Content Graceful Degradation

**Scenario**: Content data (avatars, metrics) is missing or undefined

**Strategy**:
- Provide sensible defaults for all content fields
- Hide optional sections if data is unavailable
- Use TypeScript optional chaining and nullish coalescing

```typescript
const avatars = trustIndicators?.avatars ?? [];
const showAvatars = avatars.length >= 3;

{showAvatars && (
  <div className="flex -space-x-2">
    {avatars.map((src, i) => (
      <Avatar key={i} src={src} />
    ))}
  </div>
)}
```

### Accessibility Edge Cases

**Scenario**: Screen reader announces content in wrong order or skips elements

**Strategy**:
- Use semantic HTML structure (section > div > h1 > p > nav)
- Add `aria-label` attributes for screen reader context
- Ensure visual showcase decorative elements have `aria-hidden="true"`
- Test with NVDA, JAWS, and VoiceOver


## Testing Strategy

### Property-Based Testing Assessment

**Property-based testing (PBT) is NOT applicable to this feature** because:

1. **UI Rendering Focus**: The hero section is primarily a presentational component with visual layout, styling, and animation concerns
2. **No Pure Functions**: There are no data transformation functions or algorithms that benefit from universal property verification
3. **Configuration-Based**: The component consumes static configuration data rather than processing variable inputs
4. **External Validation Required**: Visual correctness, accessibility, and responsive behavior require human/tool validation beyond unit assertions

**Alternative Testing Approaches:**
- **Snapshot Testing**: Capture component output for regression detection
- **Visual Regression Testing**: Use tools like Percy or Chromatic (if available)
- **Accessibility Testing**: Automated WCAG checks with jest-axe or pa11y
- **Manual QA**: Human review for visual polish, animation smoothness, responsive behavior

### Unit Testing Strategy

Focus on specific behaviors and edge cases rather than universal properties.


#### Test Suite 1: Component Rendering

**Test File**: `__tests__/components/site/hero.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/site/hero';

describe('Hero Component', () => {
  it('renders the headline with correct semantic HTML', () => {
    render(<Hero />);
    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toBeInTheDocument();
  });

  it('displays primary and secondary CTA buttons', () => {
    render(<Hero />);
    const primaryCTA = screen.getByRole('link', { name: /start a project/i });
    const secondaryCTA = screen.getByRole('link', { name: /view our work/i });
    expect(primaryCTA).toBeInTheDocument();
    expect(secondaryCTA).toBeInTheDocument();
  });

  it('renders supporting text with specific service mentions', () => {
    render(<Hero />);
    const supportingText = screen.getByText(/web applications|business software/i);
    expect(supportingText).toBeInTheDocument();
  });

  it('displays trust indicators', () => {
    render(<Hero />);
    const trustIndicator = screen.getByText(/trusted by|projects|years/i);
    expect(trustIndicator).toBeInTheDocument();
  });
});
```

