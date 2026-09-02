---
title: "Building a Psychology Practice Website: Technical & UI Decisions"
description: "A deep dive into the technical stack, UI design system, and SEO strategy behind a psychology practice website built with React, Vite, and TypeScript."
pubDate: 2026-09-02
tags: ["react", "vite", "typescript", "css-modules", "seo", "client-project", "ui-design"]
---

I recently completed a website for a psychology practice in Sevilla. This post covers the technical decisions, design system, and SEO strategy behind the project.

## Project Context

The client needed a professional website that:
- Conveys trust and approachability for potential patients
- Ranks for local searches ("psicóloga Sevilla", "terapia Sevilla")
- Integrates with existing booking flow (Doctoralia)
- Works flawlessly on mobile (most patients browse from phones)

## Technical Stack

### React + Vite + TypeScript

I chose Vite over Next.js for this project because:
- **Simpler deployment**: Static site on Vercel, no server-side complexity needed
- **Faster builds**: Sub-second HMR during development
- **Smaller bundle**: No unnecessary framework overhead for a content-focused site

TypeScript provides type safety for the component props and data structures, catching errors at build time.

### CSS Modules

Instead of Tailwind or styled-components, I used CSS Modules for:
- **Scoped styles**: No class name conflicts, no global CSS pollution
- **Familiar syntax**: Regular CSS with `.module.css` extension
- **Zero runtime cost**: Compiled to static CSS at build time

```tsx
import styles from "./Hero.module.css";

function Hero() {
  return <section className={styles.hero}>...</section>;
}
```

This approach scales well for a 7-section landing page and keeps the bundle lean.

## Design System

### Color Palette

The palette needed to convey calm, trust, and professionalism:

```css
:root {
  --color-primary: #8BA888;        /* Sage green - calm, growth */
  --color-primary-dark: #6B8E6B;   /* Darker green - depth */
  --color-beige: #F0E8DF;          /* Warm beige - approachability */
  --color-bg: #FAFAF8;             /* Off-white - clean, not sterile */
  --color-text: #3A3A3A;           /* Dark gray - softer than pure black */
  --color-text-light: #666666;     /* Medium gray - secondary text */
  --color-gold: #C8A96E;           /* Gold accent - premium feel */
}
```

The sage green (#8BA888) was chosen because it's associated with nature, growth, and calm—perfect for therapy. The off-white background (#FAFAF8) avoids the clinical feel of pure white.

### Typography

- **Headings**: Playfair Display (serif) — elegant, trustworthy, traditional
- **Body**: Inter (sans-serif) — highly readable, modern, accessible

This combination balances professionalism (serif) with approachability (sans-serif). The serif font for headings adds gravitas without feeling outdated.

### Spacing & Layout

- **Container**: Max-width 1140px, centered with 24px padding
- **Sections**: 80px vertical padding (generous whitespace)
- **Grid**: CSS Grid for responsive layouts (4-col → 2-col → 1-col)

![Hero section with sage green CTA button and professional photography](/images/web-ester/hero-desktop.png)

## UI Improvements Based on Analysis

After the initial launch, I conducted a UX audit and made several improvements. This section demonstrates product thinking beyond implementation:

### 1. Replaced Emojis with SVG Icons

The "Servicios" section originally used emojis (🧠💑☁️), which:
- Render differently across operating systems
- Look unprofessional next to the elegant typography
- Had a missing icon bug in one card

**Solution**: Custom SVG icons with consistent stroke width and color:

```tsx
const services = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7l-3 3-3-3c-2-1.5-4-4-4-7a7 7 0 0 1 7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    title: "Terapia Individual en Sevilla",
    // ...
  }
];
```

The icons use `currentColor` so they inherit the primary green color, maintaining visual consistency.

![Servicios section with custom SVG icons replacing emojis](/images/web-ester/servicios-icons.png)

### 2. Added Form Feedback States

The contact form originally had no feedback after submission—users didn't know if it worked.

**Solution**: Added state management with visual feedback:

```tsx
const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("sending");
  try {
    const res = await fetch("/api/contact", { /* ... */ });
    if (res.ok) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
    }
  } catch {
    setStatus("error");
  }
};
```

Users now see "Enviando...", "Mensaje enviado. Te responderé pronto.", or error messages.

![Contact form showing success feedback state](/images/web-ester/form-feedback.png)

### 3. Improved Text Contrast

The secondary text color (#7A7A7A) on the off-white background (#FAFAF8) barely passed WCAG AA contrast requirements (4.5:1 ratio).

**Fix**: Darkened to #63696A for better readability, especially important for older patients.

### 4. Custom Favicon

The original favicon was the full hero photo scaled down to 16px—a blurry mess.

**Solution**: Created a simple SVG favicon with the initials "EB" in Playfair Display, maintaining brand recognition even at tiny sizes.

## SEO Strategy

### Meta Tags

```html
<title>Ester Benjumea | Psicóloga General Sanitaria en Sevilla</title>
<meta name="description" content="Ester Benjumea - Psicóloga General Sanitaria en Sevilla. Terapia individual, de pareja y online. Especialista en ansiedad, estrés y trastornos psicosomáticos. Reserva tu cita." />
<link rel="canonical" href="https://esterbenjumea.com/" />
```

The title includes name + profession + city (key for local SEO). The description mentions specialties and includes a call-to-action ("Reserva tu cita").

### Structured Data (Schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "Psychologist",
  "name": "Ester Benjumea",
  "telephone": "+34663628917",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Sevilla",
    "addressCountry": "ES"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "20:00"
  }
}
```

This helps Google understand the business type, location, and hours—critical for appearing in local search results and the "Local Pack".

### Open Graph & Twitter Cards

Configured for proper preview when shared on social media or WhatsApp (common in Spain):

```html
<meta property="og:title" content="Ester Benjumea | Psicóloga General Sanitaria en Sevilla" />
<meta property="og:image" content="https://esterbenjumea.com/FotoPrincipal.png" />
<meta property="og:locale" content="es_ES" />
```

## Responsive Design

The site is mobile-first with breakpoints at 768px and 500px:

```css
/* Desktop: 4-column grid */
.grid {
  grid-template-columns: repeat(4, 1fr);
}

/* Tablet: 2-column grid */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: Single column */
@media (max-width: 500px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

The Hero section switches from a 2-column layout (text + image side-by-side) to stacked on mobile, with centered text.

![Mobile responsive layout](/images/web-ester/mobile-view.png)

## Performance Considerations

- **No heavy frameworks**: React + Vite = minimal JavaScript
- **CSS Modules**: No runtime CSS-in-JS overhead
- **Optimized fonts**: Google Fonts with `display=swap` to avoid FOIT
- **Static images**: No lazy loading needed for a single-page site
- **Preconnect hints**: `<link rel="preconnect" href="https://fonts.gstatic.com" />`

## Deployment

Deployed on Vercel with automatic HTTPS, CDN, and preview deployments. The API endpoint for the contact form uses Vercel serverless functions.

## Lessons Learned

1. **Client photos matter**: The "Sobre mí" section used a mirror selfie that undermined the professional tone. Always use consistent, high-quality photography.
2. **SEO is more than meta tags**: Indexation, authority, and domain setup are critical. The site needs Google Search Console verification and sitemap submission.
3. **Form feedback is essential**: Users need confirmation that their action worked.
4. **Accessibility isn't optional**: Contrast ratios matter, especially for healthcare sites with older demographics.

## Results

The site is live at [web-ester-tau.vercel.app](https://web-ester-tau.vercel.app/) (production domain: esterbenjumea.com).
