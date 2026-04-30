# Carbon Trade X MVP

A comprehensive web platform for verifying, onboarding, and simulating high-quality carbon credits from major registries including Verra, Gold Standard, and India's CCTS.

## Features

- **Credit Verification**: Search and verify carbon credits using live CAD Trust API data
- **Educational Content**: Interactive learning modules on carbon credit quality criteria
- **Registry Onboarding**: Step-by-step guidance for Verra and Gold Standard registry onboarding
- **AI MRV System**: Multi-agent AI system for automated carbon project quality assessment
- **Trading Simulator**: Realistic marketplace for practicing carbon credit trading

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI**: Vercel AI SDK
- **Data Persistence**: Browser localStorage (demo mode)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
carbon-trade-x-mvp/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── dashboard/         # Dashboard components
│   ├── verify/            # Verification components
│   ├── learn/             # Educational content components
│   ├── onboarding/        # Onboarding flow components
│   ├── ai-mrv/            # AI MRV system components
│   └── simulator/         # Trading simulator components
├── lib/                   # Utility functions and services
│   ├── api/              # API clients
│   ├── storage/          # localStorage utilities
│   ├── types/            # TypeScript type definitions
│   └── mock-data/        # Mock data for fallback
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## Configuration

The application is configured to use the CAD Trust Data Model 2.0 API:

- **API URL**: https://rpc.climateactiondata.org/v2
- **Protocol**: JSON-RPC 2.0

Configuration is set in `next.config.ts`.

## Development

This is a demo-mode SaaS application that uses browser localStorage for data persistence. No backend database or authentication infrastructure is required.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

### Manual Deployment

```bash
# Build the application
npm run build

# The build output will be in the .next directory
# Deploy the .next directory and package.json to your hosting provider

# Start the production server
npm start
```

### Environment Variables

No environment variables are required for demo mode. The application will work out of the box with mock data fallback.

Optional environment variables for production:

- `CAD_TRUST_API_KEY`: API key for authenticated CAD Trust requests (optional)
- `NEXT_PUBLIC_APP_URL`: Base URL for the application (optional)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Private - All rights reserved

## Powered By

- [CAD Trust Data Model 2.0](https://climateactiondata.org)
- [Verra Registry](https://verra.org)
- [Gold Standard](https://goldstandard.org)
- [CCTS Registry](https://ccts.gov.in)
