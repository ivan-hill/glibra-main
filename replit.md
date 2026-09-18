# Overview

GLIBRA is an AI-powered travel coordination platform that connects service providers (Hosts) with travelers through bundled trip experiences. The platform features an immersive scroll-based onboarding experience for hosts to list their services (attractions, accommodations, transportation, dining, photography) and for travelers to build coordinated trip bundles.

## Recent Changes (April 2026)

### Dark Editorial Homepage Redesign (Full Rewrite)
- **Design system**: Complete dark editorial aesthetic — `#080808` bg, `#f0ece2` off-white, `#c9a96e` gold, `#00d1c1` teal, all in `.dark-editorial` CSS scope
- **Fonts**: Cormorant Garamond (serif body/headlines) + DM Mono (monospace UI labels) added to index.html
- **GLIBRA™ Logo Split Animation**: Each character wrapped in `.de-char-mask` clip-window; `.de-char-inner` slides up 50% on hover to reveal italic gold alternate with staggered transition-delay per letter (white default, gold italic on hover)
- **Custom Cursor System**: Blob "Explore" cursor (`.de-cursor`) on hero overlay only via GSAP; ring (`.de-ring`) + dot (`.de-dot`) follow mouse everywhere via RAF lerp
- **GSAP loader**: Letters slide in from right (stagger 0.1), then exit left, then fade to reveal hero — total ~3s
- **Hero**: Full-viewport Cormorant Garamond "Travel, handled.™" with outline text and gold ™ glyph
- **Binary Fork Grid**: Two-column `.de-fork-grid` with flood-fill `::before` hover (gold host / teal traveler), watermark numbers, word-split italic hover animation (`.de-wt` / `.de-wti`)
- **Swiper Marquee**: Auto-scrolling service categories with `.de-marquee` selector
- **How-It-Works List**: 4-step `.de-work-list` with underline-sweep hover on each item name
- **Philosophy Section**: Split grid with large italic quote and mission copy
- **Stats + CTA**: Animated counters (120+, $8, 15k) via IntersectionObserver; "Relax. We've got this." headline with flood-fill button
- **Full-screen Menu**: Clip-path sliding overlay with italic hover states, staggered link reveals
- **Avery Mascot**: Preserved and rendering above all content
- **Mobile**: Single-column fork grid, stacked footer, adjusted padding breakpoints at 720px

### GSAP Animation System & New Logos
- **Animation Initializer**: `client/src/lib/animations/onboardAnimations.ts` — reusable GSAP animation module
- **Page Loader**: Cinematic GLIBRA letter reveal on initial load (gradient cyan→purple, Orbitron font), fades out after ~1.3s
- **Hero Entrance**: h1 fades up after loader completes
- **Scroll-Triggered Sections**: `.animate-section` class on all major sections — fade up from y=80 as they enter viewport
- **Reveal Lines**: `.reveal-line` on key copy paragraphs — staggered fade-up reveals
- **Custom Cursor**: Desktop-only circle cursor that appears on hero video overlay area, follows mouse with GSAP
- **Provider Slider**: Swiper.js horizontal auto-scrolling strip of service category chips between sections
- **Final CTA Entrance**: `.final-cta` GSAP entrance animation for the mission section CTA
- **New Logos Integrated**: Updated to use latest logo assets (`Blk-logo_1777563860626.png`, `logo-small_1777563860626.png`, `fulllogo_transparent_1755820006270_1777563860626.png`)
- **Mobile Safe**: Cursor disabled on mobile, all animations respect `prefers-reduced-motion`
- **Cleanup**: All GSAP triggers and Swiper instances properly destroyed on unmount
- **Packages Added**: `swiper@latest`, `locomotive-scroll@4` (installed but native scroll used for iframe compatibility)

## Recent Changes (January 2026)

### Homepage Conversion Optimization
- **Binary User Fork**: Homepage now starts with "I'm here to..." choice between Host and Traveler paths
- **Outcome-Focused Headlines**: "Get Discovered Inside Real Travel Plans" (hosts) / "Stop Juggling Apps" (travelers)
- **Concrete Bundle Example**: "Fall Wedding Weekend (Finger Lakes)" showing real service combinations
- **Visibility-Based Pricing**: Tiers reframed as visibility levels (minimal exposure → flagship destination)
- **Reassurance Section**: "How Hosts Get Booked" explaining AI matching and performance-based visibility
- **Social Proof**: "Used in pilot programs across Upstate NY", "Designed with real hosts"
- **Mission Statement**: "Why GLIBRA Exists" section anchoring the Connected Travel thesis
- **Collapsible Tech Stack**: Technical details moved to expandable section for developers

### AI Engine Optimization
- Schema.org structured data (Organization, FAQPage, SoftwareApplication, ItemList)
- Comprehensive SEO meta tags (title, description, keywords)
- Open Graph and Twitter Card tags
- Semantic HTML with ARIA landmarks and proper heading hierarchy

### Avery Mascot (January 2026)
- **Floating Guide**: Fairy mascot that appears in bottom-right corner
- **Scroll-Triggered Narration**: Messages change based on which section is visible
- **Context-Aware**: Different message sets for Host vs Traveler paths
- **Interactive**: Can be minimized, closed, and restored
- **Video Loop**: Uses fairy_loop.mp4 for animated character

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18+ with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and a dark-mode design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching

## Animation & Visual Effects
- **Scroll Animation**: GSAP with ScrollTrigger for complex scroll-based animations and pinned sections
- **Smooth Scrolling**: Lenis for buttery smooth scroll behavior across the application
- **WebGL Graphics**: React Three Fiber ecosystem (@react-three/fiber, @react-three/drei) for 3D graphics and shader effects
- **Custom Shaders**: WebGL fragment shaders for dynamic background effects that respond to scroll position

## Backend Architecture
- **Server Framework**: Express.js with TypeScript for the REST API
- **Development Setup**: Custom Vite integration for hot module replacement and development server
- **File Structure**: Modular route registration system with separated concerns for storage and business logic

## Data Storage
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle with Zod integration for type-safe database operations and validation
- **Connection**: Neon Database serverless PostgreSQL with connection pooling
- **Schema Management**: Drizzle-kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing

## Styling & Design System
- **Design Tokens**: CSS custom properties for consistent spacing, colors, and typography
- **Component Library**: Comprehensive UI component system with variants and consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Typography**: Multiple font families including DM Sans, Geist Mono, and Fira Code

## Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: Comprehensive TypeScript configuration with strict mode enabled
- **Code Quality**: Path mapping for clean imports and organized file structure
- **Error Handling**: Runtime error overlay integration for development debugging

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18+ with React DOM for the frontend framework
- **Node.js Runtime**: Express server with TypeScript execution via tsx

## Animation Libraries
- **GSAP**: Professional animation library with ScrollTrigger plugin for scroll-based animations
- **Lenis**: Smooth scrolling library from Studio Freight for enhanced scroll experience
- **React Three Fiber**: React renderer for Three.js enabling declarative 3D graphics

## Database & ORM
- **Neon Database**: Serverless PostgreSQL database hosting (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect support
- **Database Tools**: Drizzle-kit for schema management and migrations

## UI & Styling
- **Radix UI**: Comprehensive primitive components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **shadcn/ui**: Pre-built component library built on Radix primitives

## Development & Build Tools
- **Vite**: Fast build tool with React plugin and TypeScript support
- **TypeScript**: Static type checking across the entire application
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins

## Additional Integrations
- **TanStack Query**: Server state management for API data fetching and caching
- **Wouter**: Lightweight routing library for single-page application navigation
- **Class Variance Authority**: Utility for creating component variants with Tailwind
- **Date-fns**: Modern date manipulation library for handling temporal data