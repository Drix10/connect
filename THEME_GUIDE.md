# Carbon Trade X Theme Guide

## Overview

The Carbon Trade X platform uses a premium dark theme with carbon-green accents to create a trustworthy and modern interface.

## Color Palette

### Primary Color: Carbon Green (#10b981)

The primary color is a vibrant emerald green that represents sustainability and growth.

**Usage in Tailwind:**

```tsx
// Background
<div className="bg-carbon-green">...</div>

// Text
<p className="text-carbon-green">...</p>

// Border
<div className="border-carbon-green">...</div>

// Shades available: 50, 100, 200, 300, 400, 500 (default), 600, 700, 800, 900, 950
<div className="bg-carbon-green-500">...</div>
<div className="bg-carbon-green-700">...</div>
```

### Secondary Color: Forest Green (#166534)

The secondary color is a deep forest green that provides contrast and depth.

**Usage in Tailwind:**

```tsx
// Background
<div className="bg-forest-green">...</div>

// Text
<p className="text-forest-green">...</p>

// Shades available: 50, 100, 200, 300, 400, 500, 600, 700 (default), 800, 900
<div className="bg-forest-green-700">...</div>
<div className="bg-forest-green-900">...</div>
```

### Theme Colors (CSS Variables)

The platform uses CSS variables for consistent theming across components:

- **Background**: Dark gray (#0a0a0a / hsl(0 0% 4%))
- **Foreground**: Light gray (#ededed / hsl(0 0% 93%))
- **Card**: Slightly lighter dark (#0f0f0f / hsl(0 0% 6%))
- **Primary**: Carbon green (#10b981 / hsl(142 76% 36%))
- **Secondary**: Forest green (#166534 / hsl(142 65% 20%))

**Usage in Tailwind:**

```tsx
// Using theme colors
<div className="bg-background text-foreground">...</div>
<div className="bg-card text-card-foreground">...</div>
<button className="bg-primary text-primary-foreground">...</button>
<button className="bg-secondary text-secondary-foreground">...</button>
```

## Dark Theme

The dark theme is configured as the default and uses class-based mode.

**HTML Setup:**

```html
<html class="dark">
  <!-- Your app content -->
</html>
```

The dark theme is already applied by default in the root layout.

## Responsive Breakpoints

The platform uses the following breakpoints for responsive design:

| Breakpoint | Min Width | Usage                            |
| ---------- | --------- | -------------------------------- |
| `xs`       | 475px     | Extra small devices              |
| `sm`       | 640px     | Small devices (mobile landscape) |
| `md`       | 768px     | Medium devices (tablets)         |
| `lg`       | 1024px    | Large devices (desktops)         |
| `xl`       | 1280px    | Extra large devices              |
| `2xl`      | 1536px    | 2X large devices                 |

**Usage in Tailwind:**

```tsx
// Responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">...</div>

// Sidebar collapse on mobile
<aside className="hidden md:block">...</aside>

// Mobile-first approach
<div className="text-sm md:text-base lg:text-lg">...</div>
```

## Component Examples

### Button with Primary Color

```tsx
<button className="bg-carbon-green hover:bg-carbon-green-600 text-white px-4 py-2 rounded-md transition-colors">
  Get Started
</button>
```

### Card with Dark Theme

```tsx
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-foreground text-xl font-semibold">Card Title</h3>
  <p className="text-muted-foreground mt-2">Card description</p>
</div>
```

### Badge with Secondary Color

```tsx
<span className="bg-forest-green text-white px-3 py-1 rounded-full text-sm">
  Live CAD Trust
</span>
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Grid items */}
</div>
```

## Best Practices

1. **Use semantic color names**: Prefer `bg-primary` over `bg-carbon-green` when using theme colors for better consistency.

2. **Maintain contrast**: Ensure text has sufficient contrast against backgrounds for accessibility.

3. **Mobile-first**: Write mobile styles first, then add responsive modifiers for larger screens.

4. **Consistent spacing**: Use Tailwind's spacing scale (4, 8, 16, 24, 32, etc.) for consistent layouts.

5. **Smooth transitions**: Add `transition-colors` or `transition-all` for interactive elements.

## Testing the Theme

Run the Tailwind configuration tests:

```bash
npm test -- tailwind.config.test.ts --run
```

## References

- Requirements: 1.1, 1.2
- Design Document: Theme Configuration section
- Tailwind CSS Documentation: https://tailwindcss.com/docs
