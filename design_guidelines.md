# GLIBRA AI Host Onboarding - Design Guidelines

## Design Approach
**Hybrid Reference-Based**: Drawing from Linear's professional clarity + Stripe's trust-building onboarding patterns, customized with specified gradient aesthetics for travel industry appeal.

## Core Design Elements

### Typography
- **Titles**: Orbitron (600-700 weight), gradient text treatment (#00D4FF → #9B59B6)
- **Headings**: Orbitron (500 weight), 2xl-4xl sizes, dark gray (#1a1a1a)
- **Body**: Inter or System UI (400-500 weight), 16-18px, dark gray (#2d2d2d)
- **Labels/Meta**: 14px, medium weight, gray (#666)

### Layout System
- **Spacing units**: Tailwind 4, 6, 8, 12, 16, 24 (consistent rhythm)
- **Container**: max-w-7xl with px-6 padding
- **Grid**: 12-column for desktop, single column mobile
- **Section padding**: py-16 mobile, py-24 desktop

### Component Library

**Navigation**
- Fixed top bar, white background with subtle shadow
- Logo (left), "Already registered? Sign In" link (right)
- Height: 72px desktop, 64px mobile

**Hero Section**
- Full-width image background (travel industry collage: hotels, attractions, dining)
- Overlay gradient (dark, 60% opacity)
- Centered content: Large Orbitron title with gradient, subtitle, primary CTA
- Height: 65vh, image covers entire area
- CTA button: Blur background (backdrop-blur-md), white text, gradient border

**Service Selection Cards (Primary Feature)**
- 2-column grid (md), 3-column (lg), single column mobile
- Card structure: Icon (60px), service name, short description, "Select" checkbox state
- Interactive states: Hover elevates card (shadow-lg), selected shows gradient border
- Services: Accommodations, Attractions, Transportation, Dining, Photography Services
- Spacing: gap-6 between cards, p-8 internal padding

**Benefits Section**
- 3-column feature grid
- Icons (gradient treatment), bold titles, descriptive text
- Features: Global Reach, Easy Management, Instant Payments

**Process Timeline**
- Horizontal stepper (4 steps): Select Services → Verify Details → Complete Profile → Go Live
- Connected line with gradient, numbered circles
- Mobile: Vertical stack

**CTA Footer Section**
- Centered layout, gradient background (subtle, 10% opacity)
- Large heading, supporting text, primary button
- py-20 spacing

**Footer**
- 4-column grid: About, Services, Resources, Contact
- Social icons, copyright, links
- Background: light gray (#f8f8f8)

## Images

**Hero Image**: Wide panoramic composition featuring diverse travel services - luxury hotel facade, scenic attraction view, elegant restaurant interior, transportation (maybe aerial cable car). Professional photography, bright and inviting. 1920x800px minimum.

**Service Card Icons**: Modern line icons (gradient fills) for each service category - use icon library with custom gradient application.

## Animations
- Card hover: Smooth lift (translateY -4px, 200ms ease)
- Gradient text: Subtle shimmer on hover (optional enhancement)
- Checkbox selection: Scale animation on check
- Scroll-triggered: Fade-in for timeline steps (staggered)

## Accessibility
- High contrast text (4.5:1 minimum on all backgrounds)
- Gradient text paired with solid fallback for readability
- Keyboard navigation for all interactive cards
- ARIA labels for service selection checkboxes
- Focus rings: 2px gradient border offset

## Key Design Principles
1. **Professional trust**: Clean layouts, generous whitespace, premium imagery
2. **Clarity over decoration**: Gradient used strategically (titles, accents), not overwhelming
3. **Guided journey**: Clear visual hierarchy leading users through service selection → registration
4. **Service provider confidence**: Enterprise-grade appearance that conveys platform credibility