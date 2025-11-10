# Navigation Component Guide

## Overview

The `Navigation` component is a unified, reusable navigation bar used across all pages in the VoiceCraft application. It follows the Brutalist design system and provides consistent navigation experience.

## Features

- 🎨 Brutalist design with yellow accents
- 📱 Fully responsive with mobile menu
- 🔝 Sticky header with scroll detection
- ⚙️ Highly customizable
- ♿ Accessible with proper ARIA labels
- 🎯 TypeScript support

## Basic Usage

### Simple Import (Recommended)

```tsx
import { Navigation } from "@/components/marketing/layout"

export default function Page() {
  return <Navigation />
}
```

This uses the default navigation links:
- Features → `/features`
- Pricing → `/pricing`
- About → `/about`
- Contact → `/contact`

And default CTA button that redirects to `/dashboard`.

### Custom Navigation Links

```tsx
import { Navigation } from "@/components/marketing/layout"

export default function Page() {
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <Navigation navLinks={navLinks} />
  )
}
```

### Custom CTA Button

```tsx
import { Navigation } from "@/components/marketing/layout"

export default function Page() {
  return (
    <Navigation
      ctaButton={{
        text: "Sign Up",
        onClick: () => window.location.href = '/signup'
      }}
    />
  )
}
```

### With Custom Logo Text

```tsx
import { Navigation } from "@/components/marketing/layout"

export default function Page() {
  return (
    <Navigation logoText="My App" />
  )
}
```

### Transparent Header (for Hero Sections)

```tsx
import { Navigation } from "@/components/marketing/layout"

export default function Page() {
  return (
    <Navigation transparent />
  )
}
```

The header will be transparent initially and become solid white when user scrolls down.

## Props API

### `NavigationProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoText` | `string` | `"VoiceCraft"` | Text displayed next to the logo |
| `navLinks` | `NavLink[]` | Default links | Array of navigation links |
| `ctaButton` | `object` | Default button | Call-to-action button configuration |
| `transparent` | `boolean` | `false` | Makes header transparent until scroll |
| `className` | `string` | `""` | Additional CSS classes |

### `NavLink` Type

```typescript
interface NavLink {
  label: string  // Display text
  href: string   // Link destination
}
```

### `ctaButton` Object

```typescript
{
  text: string           // Button text
  href?: string          // Optional href (for <a> tag)
  onClick?: () => void   // Optional click handler
}
```

## Examples

### Homepage with Anchor Links

```tsx
import { Navigation } from "@/components/marketing/layout"

export default function HomePage() {
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Demo", href: "#demo" },
  ]

  return (
    <div>
      <Navigation
        navLinks={navLinks}
        transparent
        ctaButton={{
          text: "Get Started Free",
          onClick: () => window.location.href = '/dashboard'
        }}
      />
      {/* Rest of your page */}
    </div>
  )
}
```

### Static Page (About, Contact, etc.)

```tsx
import { Navigation } from "@/components/marketing/layout"
import { Footer } from "@/components/marketing/layout"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="py-20">
        {/* Your content */}
      </main>

      <Footer />
    </div>
  )
}
```

### Custom Dashboard Link

```tsx
import { Navigation } from "@/components/marketing/layout"

export default function DashboardPage() {
  return (
    <Navigation
      navLinks={[
        { label: "Audios", href: "/dashboard/audios" },
        { label: "Voices", href: "/dashboard/voices" },
        { label: "Projects", href: "/dashboard/projects" },
      ]}
      ctaButton={{
        text: "New Audio",
        onClick: () => console.log('Create new audio')
      }}
    />
  )
}
```

## Design System

The Navigation component follows the VoiceCraft Brutalist design system:

- **Colors**: Black, white, and yellow (#FACC15)
- **Borders**: 4px solid black borders
- **Typography**: Uppercase, bold, tight tracking
- **Shadows**: Brutalist shadows with yellow offset
- **Transitions**: Smooth 300ms transitions

## Mobile Behavior

- Navigation links hidden on mobile (`md:flex`)
- Hamburger menu button appears
- Full-screen mobile menu slides in
- Auto-closes when link is clicked

## Accessibility

- Semantic HTML5 `<header>` and `<nav>`
- Proper ARIA labels on menu button
- Keyboard navigation support
- Focus states on all interactive elements

## Integration with Existing Components

The `Navigation` component is compatible with and can be used alongside:

- `Header` component (original implementation)
- `Footer` component
- All page layouts
- Dashboard layouts

## Migration from Inline Navigation

**Before:**
```tsx
<header className="sticky top-0 z-50 border-b-4 border-black bg-white">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* ... inline navigation code ... */}
  </div>
</header>
```

**After:**
```tsx
import { Navigation } from "@/components/marketing/layout"

<Navigation />
```

## Best Practices

1. **Use default props when possible** - The defaults are designed for most use cases
2. **Keep navigation consistent** - Use the same links across similar pages
3. **Use transparent mode sparingly** - Only for hero sections with full-width backgrounds
4. **Test on mobile** - Always verify mobile menu works correctly
5. **Prefer onClick over href** - For better client-side routing control

## TypeScript Support

Full TypeScript support with proper types:

```typescript
import { Navigation, NavigationProps, NavLink } from "@/components/marketing/layout"

const customNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
]

const props: NavigationProps = {
  logoText: "VoiceCraft",
  navLinks: customNavLinks,
  ctaButton: {
    text: "Sign Up",
    onClick: () => console.log('Signup clicked')
  },
  transparent: false,
}

<Navigation {...props} />
```

## Related Components

- `Header` - Original header component (deprecated in favor of Navigation)
- `Footer` - Footer component for page bottom
- `Container` - Max-width container component
- `Button` - Button component for CTAs

## Support

For issues or questions about the Navigation component, see:
- [Component Documentation](./COMPONENTS.md)
- [Design System Guide](./docs/ARCHITECTURE.md)
- [GitHub Issues](https://github.com/voicecraft/issues)
