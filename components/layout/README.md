# Layout Components

This directory contains the core layout components for the Carbon Trade X MVP application.

## Components

### Sidebar (`Sidebar.tsx`)

A collapsible navigation sidebar with the following features:

- **Responsive Design**: Automatically collapses on mobile devices (< 768px)
- **Navigation Items**: Dashboard, Verify Credit, Learn, Onboarding, AI MRV, Simulator, Profile
- **Active Route Highlighting**: Uses `usePathname` to highlight the current page
- **Mobile Overlay**: Displays a backdrop overlay when sidebar is open on mobile
- **Demo Mode Indicator**: Shows "Demo Mode" and "Data stored locally" text when expanded
- **Smooth Animations**: Transitions for collapse/expand with Tailwind CSS

### Navbar (`Navbar.tsx`)

A top navigation bar with:

- **Logo**: Carbon Trade X branding with link to dashboard
- **Live CAD Trust Badge**: Animated badge indicating live API connection
- **User Avatar**: Demo user profile link with avatar icon
- **Responsive**: Adapts to mobile, tablet, and desktop viewports
- **Sticky Positioning**: Stays at the top of the viewport while scrolling

### Footer (`Footer.tsx`)

A footer component featuring:

- **Registry Links**: External links to Verra, Gold Standard, CAD Trust, and CCTS registries
- **CAD Trust Attribution**: "Powered by CAD Trust Data Model 2.0" badge
- **Privacy Policy Link**: Internal link to privacy policy page
- **Copyright Notice**: © 2025 Carbon Trade X
- **Proper Link Attributes**: All external links open in new tabs with `rel="noopener noreferrer"`

### ConsentBanner (`ConsentBanner.tsx`)

A DPDPA-compliant consent banner with:

- **First Visit Detection**: Only displays on first visit (checks localStorage)
- **Privacy Information**: Explains localStorage-only data storage
- **Accept Button**: Stores consent in localStorage and hides banner
- **Dismiss Button**: Allows dismissing without accepting
- **Privacy Policy Link**: Links to detailed privacy policy
- **Persistent State**: Remembers consent across sessions

## Usage

```tsx
import { Sidebar, Navbar, Footer, ConsentBanner } from "@/components/layout";

export default function Layout({ children }: { children: React.Node }) {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <ConsentBanner />
    </>
  );
}
```

## Testing

All components have comprehensive unit tests covering:

- Component rendering
- User interactions (clicks, navigation)
- Responsive behavior
- localStorage integration
- Accessibility features

Run tests with:

```bash
npm test -- components/layout
```

## Requirements Satisfied

- **Requirement 1.2**: Uses shadcn/ui component library
- **Requirement 1.3**: Uses Lucide icon library
- **Requirement 2.1**: Collapsible sidebar navigation
- **Requirement 2.2**: Responsive design with mobile collapse
- **Requirement 2.3**: Top navbar with logo, avatar, and status badge
- **Requirement 2.4**: Footer with registry links and attribution
- **Requirement 2.5**: Responsive design for all viewports
- **Requirement 22.1, 22.2, 22.5**: CAD Trust attribution and branding
- **Requirement 23.1-23.5**: DPDPA consent banner with localStorage
- **Requirement 24.1-24.5**: External registry links with proper attributes

## Styling

All components use:

- **Tailwind CSS**: Utility-first styling
- **Carbon-green theme**: Primary color #10b981, Secondary color #166534
- **Dark theme**: Default dark mode with proper contrast
- **Smooth animations**: Framer Motion for enhanced UX
- **Responsive breakpoints**: Mobile (< 768px), Tablet (768px-1024px), Desktop (> 1024px)
