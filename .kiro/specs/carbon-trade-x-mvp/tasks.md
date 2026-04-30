# Implementation Plan: Carbon Trade X MVP

## Overview

This implementation plan breaks down the Carbon Trade X MVP into discrete, sequential coding tasks. The platform is a Next.js 15 TypeScript application with 8 main pages, 40+ React components, CAD Trust API integration, localStorage persistence, AI MRV system, and trading simulator. Each task builds incrementally, with testing sub-tasks marked as optional (\*) for faster MVP delivery.

## Tasks

- [x] 1. Initialize Next.js project and configure core dependencies
  - Create Next.js 15 project with TypeScript and App Router
  - Install and configure Tailwind CSS
  - Install shadcn/ui and initialize component library
  - Install additional dependencies: Lucide icons, Framer Motion, Recharts, Vercel AI SDK
  - Configure next.config.ts with CAD Trust API URL
  - Set up project directory structure (app/, components/, lib/, hooks/, public/)
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 26.1, 26.2_

- [ ] 2. Create type definitions and data models
  - [x] 2.1 Define core TypeScript interfaces
    - Create lib/types/index.ts with CarbonCredit, Portfolio, PortfolioCredit interfaces
    - Define CADTrustProject, MRVAnalysisResult, OnboardingProgress interfaces
    - Define UserProfile, PriceHistoryPoint, OnboardingStep interfaces
    - Define CADTrustRPCRequest and CADTrustRPCResponse interfaces
    - _Requirements: 27.1, 27.3_

  - [x] 2.2 Define component prop types
    - Create prop interfaces for all major components
    - Include CreditSearchFormProps, CreditDetailsCardProps, MarketplaceTableProps
    - Include PortfolioDisplayProps, PriceChartProps, MRVChatInterfaceProps, OnboardingChecklistProps
    - _Requirements: 27.1, 27.5_

- [ ] 3. Implement localStorage service layer
  - [x] 3.1 Create localStorage utility class
    - Create lib/storage/localStorage.ts with LocalStorageService class
    - Implement get<T>(key, defaultValue) method with type safety
    - Implement set<T>(key, value) method with error handling
    - Implement remove(key) and clear() methods
    - Implement isAvailable() method to check localStorage support
    - Handle QuotaExceededError with user-friendly messages
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 21.3_

  - [x] 3.2 Write unit tests for localStorage service
    - Test storing and retrieving different data types
    - Test default value returns when key not found
    - Test error handling for quota exceeded
    - Test behavior when localStorage unavailable
    - _Requirements: 20.5, 21.3_

  - [x] 3.3 Define storage keys constants
    - Create STORAGE_KEYS constant object with all localStorage keys
    - Include keys: PORTFOLIO, PROFILE, ONBOARDING_PROGRESS, CONSENT, MARKETPLACE
    - _Requirements: 20.1, 20.2, 20.3_

- [ ] 4. Create mock data system
  - [x] 4.1 Generate mock carbon credit data
    - Create lib/mock-data/credits.ts with 8 sample credits
    - Include 3 Verra VCUs (forestry, renewable energy, cookstoves)
    - Include 3 Gold Standard VERs (solar, wind, water purification)
    - Include 2 CCTS CCCs (afforestation, energy efficiency)
    - Ensure all credits have complete CADTrustProject structure
    - _Requirements: 28.1, 28.3, 28.4_

  - [x] 4.2 Generate mock price history data
    - Create price history generator function
    - Generate 30-day price history for each credit with realistic fluctuations
    - Store price data in lib/mock-data/priceHistory.ts
    - _Requirements: 18.4_

  - [x] 4.3 Create mock data accessor functions
    - Implement getMockProject(projectUid) function
    - Implement getMockCredit(registryId) function
    - Implement getMockPriceHistory(creditId) function
    - _Requirements: 28.2, 28.4_

- [ ] 5. Implement CAD Trust API client
  - [x] 5.1 Create API client with JSON-RPC 2.0 support
    - Create lib/api/cadTrust.ts with fetchCADTrustProject function
    - Implement JSON-RPC 2.0 request formatting
    - Use cadt_getProject method with Project_UID parameter
    - Implement 10-second timeout using AbortSignal
    - Handle network errors and fall back to mock data
    - Return data source indicator ("live" or "mock")
    - _Requirements: 5.2, 5.3, 6.1, 6.3, 6.4, 6.5_

  - [x] 5.2 Write integration tests for API client
    - Test successful API response handling
    - Test timeout behavior with mock server
    - Test error response handling
    - Test fallback to mock data on failure
    - _Requirements: 6.3, 6.5_

- [ ] 6. Set up global layout and theme configuration
  - [x] 6.1 Configure Tailwind theme
    - Update tailwind.config.ts with carbon-green color palette
    - Define primary color (#10b981) and secondary color (#166534)
    - Configure dark theme as default
    - Set up responsive breakpoints
    - _Requirements: 1.1, 1.2_

  - [x] 6.2 Create global styles
    - Update app/globals.css with base styles
    - Define CSS variables for theme colors
    - Set up typography styles
    - Configure smooth transitions
    - _Requirements: 1.1, 1.5_

  - [x] 6.3 Create root layout component
    - Create app/layout.tsx with metadata and font configuration
    - Wrap children with necessary providers
    - Include error boundary
    - _Requirements: 2.1, 21.4_

- [ ] 7. Build core layout components
  - [x] 7.1 Create Sidebar component
    - Create components/layout/Sidebar.tsx
    - Implement collapsible behavior with state management
    - Add navigation items: Dashboard, Verify Credit, Learn, Onboarding, AI MRV, Simulator, Profile
    - Implement active route highlighting using usePathname
    - Add responsive behavior (collapse on mobile < 768px)
    - Use Lucide icons for navigation items
    - _Requirements: 2.1, 2.2, 1.3_

  - [x] 7.2 Create Navbar component
    - Create components/layout/Navbar.tsx
    - Display "Carbon Trade X" logo
    - Add demo user avatar
    - Add "Live CAD Trust" status badge
    - Implement responsive design
    - _Requirements: 2.3_

  - [x] 7.3 Create Footer component
    - Create components/layout/Footer.tsx
    - Add external registry links (Verra, Gold Standard, CAD Trust, CCTS)
    - Add CAD Trust attribution with logo
    - Add privacy policy link
    - Open all external links in new tabs with rel="noopener noreferrer"
    - _Requirements: 2.4, 22.2, 22.5, 24.1, 24.2, 24.3, 24.4, 24.5_

  - [x] 7.4 Create DPDPA consent banner component
    - Create components/layout/ConsentBanner.tsx
    - Display banner only on first visit
    - Explain localStorage-only data storage
    - Provide accept button that stores consent in localStorage
    - Hide banner after acceptance
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [x] 8. Implement shadcn/ui base components
  - Install and configure shadcn/ui components: Button, Card, Input, Tabs, Badge, Toast
  - Create components/ui/ directory with shadcn components
  - Customize component styles to match carbon-green theme
  - _Requirements: 1.2, 1.3_

- [ ] 9. Build landing page
  - [x] 9.1 Create landing page structure
    - Create app/page.tsx for landing page
    - Implement hero section with headline "Verify. Onboard. Trade. High-Quality Carbon Credits in One Place"
    - Add call-to-action button linking to /dashboard
    - _Requirements: 3.1, 3.4_

  - [x] 9.2 Add "How it Works" section
    - Create components/landing/HowItWorks.tsx
    - Display three core functions with icons and descriptions
    - Use Framer Motion for scroll animations
    - _Requirements: 3.2, 1.4_

  - [x] 9.3 Add trust signals section
    - Create components/landing/TrustSignals.tsx
    - Display logos for Verra, Gold Standard, CAD Trust, CCTS
    - Add clickable links to registry websites
    - Display "Powered by CAD Trust Data Model 2.0" badge
    - _Requirements: 3.3, 3.5, 22.1_

- [ ] 10. Build dashboard page
  - [x] 10.1 Create dashboard layout
    - Create app/(auth)/dashboard/page.tsx
    - Wrap with Sidebar and Navbar layout
    - _Requirements: 2.1, 4.1_

  - [x] 10.2 Create WelcomeCard component
    - Create components/dashboard/WelcomeCard.tsx
    - Fetch portfolio data from localStorage
    - Calculate total verified credits in tCO₂e
    - Calculate potential portfolio value in ₹
    - Display zero values with onboarding prompt when empty
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [x] 10.3 Create QuickActionsGrid component
    - Create components/dashboard/QuickActionsGrid.tsx
    - Display four action cards: Verify Credit, Onboarding, AI MRV, Simulator
    - Add icons and descriptions for each action
    - Implement hover animations with Framer Motion
    - Link cards to respective pages
    - _Requirements: 4.4_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Build credit verification page
  - [x] 12.1 Create verification page structure
    - Create app/(auth)/verify/page.tsx
    - Add page title and description
    - _Requirements: 5.1_

  - [x] 12.2 Create CreditSearchForm component
    - Create components/verify/CreditSearchForm.tsx
    - Add input field for Registry_ID or Project_UID
    - Implement input validation
    - Add search button with loading state
    - Handle form submission
    - _Requirements: 5.1_

  - [x] 12.3 Create CreditDetailsCard component
    - Create components/verify/CreditDetailsCard.tsx
    - Display project name, location, methodology
    - Display vintage and issuance details
    - Show quality indicators
    - Add "View Full Registry" external links
    - Display "Live from CAD Trust" or "Demo Data" badge based on data source
    - _Requirements: 5.4, 5.5, 6.2, 6.3, 22.3, 22.4, 28.5_

  - [x] 12.4 Integrate API client with search functionality
    - Connect CreditSearchForm to CAD Trust API client
    - Handle loading states during API calls
    - Display CreditDetailsCard with fetched data
    - Show error messages on API failures
    - _Requirements: 5.2, 5.3, 21.1, 21.2_

  - [x] 12.5 Write integration tests for verification flow
    - **Test: Search and display credit details**
    - **Validates: Requirements 5.1, 5.2, 5.4**
    - Test successful search with live data
    - Test fallback to mock data on API failure
    - Test loading states
    - Test error handling

- [ ] 13. Build educational content page
  - [x] 13.1 Create learn page structure
    - Create app/(auth)/learn/page.tsx
    - Add page title and introduction
    - _Requirements: 7.1_

  - [x] 13.2 Create QualityTabsContainer component
    - Create components/learn/QualityTabsContainer.tsx
    - Implement tab navigation for five quality criteria
    - Create tabs: MRV Process, Additionality, Permanence, Leakage Prevention, Co-benefits
    - Use shadcn/ui Tabs component
    - _Requirements: 7.1, 7.2_

  - [x] 13.3 Create QualityCriterionCard component
    - Create components/learn/QualityCriterionCard.tsx
    - Implement expandable/collapsible behavior
    - Add visual diagrams or icons using Lucide
    - Display detailed explanations
    - Include technical term definitions
    - Maintain expanded/collapsed state
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [x] 13.4 Create content for each quality criterion
    - Write detailed content for MRV Process tab
    - Write detailed content for Additionality tab
    - Write detailed content for Permanence tab
    - Write detailed content for Leakage Prevention tab
    - Write detailed content for Co-benefits tab
    - _Requirements: 7.2_

- [ ] 14. Build registry onboarding page
  - [x] 14.1 Create onboarding page structure
    - Create app/(auth)/onboarding/page.tsx
    - Add page title and description
    - _Requirements: 8.1, 9.1_

  - [x] 14.2 Create RegistryOnboardingTabs component
    - Create components/onboarding/RegistryOnboardingTabs.tsx
    - Implement tab navigation for Verra and Gold Standard
    - Use shadcn/ui Tabs component
    - _Requirements: 8.1, 9.1_

  - [x] 14.3 Create OnboardingChecklist component
    - Create components/onboarding/OnboardingChecklist.tsx
    - Display checkbox list for required steps
    - Implement progress bar showing completion percentage
    - Add mock file upload buttons
    - Enable submit button when all steps checked
    - Display success animation on submission using Framer Motion
    - Persist checklist state to localStorage
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 9.2, 9.3, 9.4, 9.5_

  - [x] 14.4 Define onboarding steps data
    - Create onboarding steps data for Verra registry
    - Create onboarding steps data for Gold Standard registry
    - Include step titles, descriptions, and document requirements
    - _Requirements: 8.1, 9.1_

  - [x] 14.5 Implement onboarding progress tracking
    - Create custom hook useOnboardingProgress
    - Load progress from localStorage on mount
    - Update localStorage on step completion
    - Calculate completion percentage
    - _Requirements: 8.2, 8.3, 9.2, 9.3_

- [x] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Build AI MRV system interface
  - [x] 16.1 Create AI MRV page structure
    - Create app/(auth)/ai-mrv/page.tsx
    - Add page title and description
    - _Requirements: 10.1_

  - [x] 16.2 Create MRVChatInterface component
    - Create components/ai-mrv/MRVChatInterface.tsx
    - Implement chat-like message display
    - Add input field for project description or Registry_ID
    - Display streaming messages
    - Handle form submission
    - _Requirements: 10.1, 10.2, 10.4_

  - [x] 16.3 Create AgentActivityIndicator component
    - Create components/ai-mrv/AgentActivityIndicator.tsx
    - Display active agent name: Researcher, Verifier, Compliance Checker, Report Generator
    - Add loading animations
    - _Requirements: 10.3_

  - [x] 16.4 Create QualityReportCard component
    - Create components/ai-mrv/QualityReportCard.tsx
    - Display overall Quality_Score (0-100) prominently
    - Show strengths and weaknesses summary
    - Display recommendations section
    - Add downloadable report option
    - _Requirements: 10.5, 14.2, 14.3, 14.4, 14.5_

- [ ] 17. Implement AI MRV Researcher Agent
  - [x] 17.1 Create Researcher agent logic
    - Create lib/ai-mrv/researcherAgent.ts
    - Accept Registry_ID or project description as input
    - Call CAD Trust API client to retrieve project details
    - Extract methodology, location, vintage, issuance data
    - Fall back to project description if API fails
    - Return structured project data
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 17.2 Integrate Researcher agent with chat interface
    - Display Researcher agent activity indicator
    - Stream Researcher findings to chat interface
    - Pass structured data to next agent
    - _Requirements: 10.3, 11.5_

- [ ] 18. Implement AI MRV Verifier Agent
  - [x] 18.1 Create Verifier agent logic
    - Create lib/ai-mrv/verifierAgent.ts
    - Accept project data from Researcher agent
    - Analyze additionality based on methodology
    - Assess permanence risk based on project type and location
    - Evaluate leakage prevention measures
    - Calculate additionality, permanence, and leakage scores
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 18.2 Integrate Verifier agent with chat interface
    - Display Verifier agent activity indicator
    - Stream Verifier assessment to chat interface
    - Pass scores to next agent
    - _Requirements: 10.3, 12.5_

- [ ] 19. Implement AI MRV Compliance Checker Agent
  - [x] 19.1 Create Compliance Checker agent logic
    - Create lib/ai-mrv/complianceAgent.ts
    - Accept project data and Verifier scores
    - Review against Verra VCS standards
    - Review against Gold Standard requirements
    - Flag missing documentation or methodology gaps
    - Return compliance status and issues list
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 19.2 Integrate Compliance Checker with chat interface
    - Display Compliance Checker activity indicator
    - Stream compliance findings to chat interface
    - Pass results to Report Generator
    - _Requirements: 10.3, 13.5_

- [ ] 20. Implement AI MRV Report Generator Agent
  - [x] 20.1 Create Report Generator agent logic
    - Create lib/ai-mrv/reportGenerator.ts
    - Accept all previous agent outputs
    - Calculate overall Quality_Score (0-100)
    - Synthesize strengths and weaknesses
    - Generate recommendations for improvement
    - Format final report structure
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 20.2 Integrate Report Generator with chat interface
    - Display Report Generator activity indicator
    - Stream final report to chat interface
    - Display QualityReportCard with results
    - _Requirements: 10.3, 14.5_

  - [x] 20.3 Implement AI MRV orchestration
    - Create lib/ai-mrv/orchestrator.ts
    - Coordinate sequential execution of all four agents
    - Handle errors and fallbacks between agents
    - Manage streaming state updates
    - Use Vercel AI SDK for streaming if applicable
    - _Requirements: 10.2, 10.3, 10.4, 25.5_

  - [x] 20.4 Write integration tests for AI MRV system
    - **Test: Complete AI MRV analysis flow**
    - **Validates: Requirements 10.2, 11.1, 12.1, 13.1, 14.1**
    - Test Researcher agent with live API data
    - Test Researcher agent with mock data fallback
    - Test Verifier agent scoring logic
    - Test Compliance Checker validation
    - Test Report Generator synthesis
    - Test orchestration and agent sequencing

- [x] 21. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 22. Build trading simulator marketplace
  - [x] 22.1 Create simulator page structure
    - Create app/(auth)/simulator/page.tsx
    - Add page title and description
    - Create layout with marketplace and portfolio sections
    - _Requirements: 15.1_

  - [x] 22.2 Create MarketplaceTable component
    - Create components/simulator/MarketplaceTable.tsx
    - Display table with columns: Registry_ID, Project Name, Price (₹/tCO₂e), Volume, Quality_Score
    - Add "Buy" button for each credit
    - Implement sorting controls (price, volume, quality score)
    - Update table when credits purchased
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 22.3 Implement marketplace data management
    - Load 8 sample credits from mock data
    - Filter out credits already in portfolio
    - Handle sorting state
    - _Requirements: 15.1, 28.1_

- [ ] 23. Build trading simulator portfolio
  - [x] 23.1 Create PortfolioDisplay component
    - Create components/simulator/PortfolioDisplay.tsx
    - Display table with columns: Registry_ID, Quantity, Purchase Price, Current Value
    - Add "Sell" button for each credit
    - Calculate and display total portfolio value
    - _Requirements: 16.1, 16.3, 16.4_

  - [x] 23.2 Implement portfolio data management
    - Load portfolio from localStorage
    - Calculate current values based on market prices
    - Update localStorage on changes
    - _Requirements: 16.2_

- [ ] 24. Implement trading transaction logic
  - [x] 24.1 Create transaction utilities
    - Create lib/utils/transactions.ts
    - Implement buyCredit(creditId, portfolio) function
    - Implement sellCredit(creditId, portfolio) function
    - Add timestamp to transactions
    - Validate transactions (prevent duplicate purchases)
    - _Requirements: 17.1, 17.2, 17.5_

  - [x] 24.2 Integrate transactions with components
    - Connect buy buttons to buyCredit function
    - Connect sell buttons to sellCredit function
    - Update localStorage after each transaction
    - Display toast notifications for confirmations
    - _Requirements: 17.3, 17.4_

  - [x] 24.3 Write integration tests for trading simulator
    - **Test: Complete buy transaction flow**
    - **Validates: Requirements 17.1, 17.3, 17.4**
    - Test buying credit updates portfolio
    - Test buying credit updates localStorage
    - Test selling credit returns to marketplace
    - Test preventing duplicate purchases
    - Test transaction notifications

- [ ] 25. Build price visualization
  - [x] 25.1 Create PriceChart component
    - Create components/simulator/PriceChart.tsx
    - Use Recharts library for line chart
    - Display price (₹/tCO₂e) on y-axis
    - Display dates on x-axis
    - Implement responsive chart sizing
    - _Requirements: 18.1, 18.2, 18.5_

  - [x] 25.2 Implement chart data management
    - Load price history from mock data
    - Update chart when credit selected from marketplace
    - Format dates for display
    - _Requirements: 18.3, 18.4_

- [ ] 26. Build user profile page
  - [x] 26.1 Create profile page structure
    - Create app/(auth)/profile/page.tsx
    - Add page title and description
    - _Requirements: 19.1_

  - [x] 26.2 Create KYCForm component
    - Create components/profile/KYCForm.tsx
    - Add form fields: name, email, organization, country
    - Display "Demo Account — KYC Approved" badge
    - Add editable API key field
    - Add save button
    - Load profile data from localStorage on mount
    - Save profile data to localStorage on submit
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

  - [x] 26.3 Write unit tests for profile management
    - Test loading profile from localStorage
    - Test saving profile to localStorage
    - Test form validation
    - _Requirements: 19.2, 19.5_

- [ ] 27. Implement error handling and loading states
  - [x] 27.1 Create error boundary component
    - Create components/ErrorBoundary.tsx
    - Catch React component errors
    - Display user-friendly error fallback
    - Log errors for debugging
    - _Requirements: 21.4, 21.5_

  - [x] 27.2 Create loading components
    - Create components/ui/LoadingSpinner.tsx
    - Create components/ui/SkeletonScreen.tsx
    - Use in all async operations
    - _Requirements: 21.1_

  - [x] 27.3 Add error handling to API calls
    - Implement retry logic for failed requests
    - Display error messages with retry options
    - Handle localStorage unavailable scenarios
    - _Requirements: 21.2, 21.3_

  - [x] 27.4 Create toast notification system
    - Configure shadcn/ui Toast component
    - Create toast utility functions
    - Use for transaction confirmations and errors
    - _Requirements: 17.3, 21.2_

- [ ] 28. Implement responsive design
  - [x] 28.1 Add mobile breakpoints
    - Test all pages on mobile viewport (< 768px)
    - Ensure sidebar collapses on mobile
    - Verify table responsiveness
    - Test form layouts on small screens
    - _Requirements: 2.2, 2.5_

  - [x] 28.2 Add tablet breakpoints
    - Test all pages on tablet viewport (768px - 1024px)
    - Verify component layouts adapt properly
    - _Requirements: 2.5_

  - [x] 28.3 Optimize touch interactions
    - Ensure buttons have adequate touch targets
    - Test mobile navigation
    - _Requirements: 2.5_

- [ ] 29. Add animations and transitions
  - [x] 29.1 Implement page transitions
    - Add Framer Motion page transitions
    - Implement smooth route changes
    - _Requirements: 1.4_

  - [x] 29.2 Add component animations
    - Animate card hover states
    - Animate modal appearances
    - Animate success states (onboarding completion)
    - _Requirements: 1.4, 8.5, 9.5_

  - [x] 29.3 Add loading animations
    - Animate skeleton screens
    - Animate spinner components
    - Animate agent activity indicators
    - _Requirements: 21.1_

- [ ] 30. Create documentation and deployment files
  - [x] 30.1 Write README.md
    - Document project overview
    - Add setup instructions
    - Add deployment instructions
    - Document environment variables
    - Add technology stack section
    - _Requirements: 26.3, 27.2_

  - [x] 30.2 Create .gitignore
    - Exclude node_modules
    - Exclude .next build directory
    - Exclude environment files
    - Exclude IDE-specific files
    - _Requirements: 26.4_

  - [x] 30.3 Add code documentation
    - Add JSDoc comments to exported functions
    - Add inline comments for complex logic
    - Document component props with TypeScript
    - _Requirements: 27.1, 27.2, 27.5_

  - [x] 30.4 Verify build process
    - Run `npm run build` and ensure no errors
    - Test production build locally with `npm start`
    - Verify all pages render correctly in production mode
    - _Requirements: 26.5_

- [ ] 31. Final integration and testing
  - [x] 31.1 Test complete user flows
    - Test landing page → dashboard → verify credit flow
    - Test dashboard → simulator → buy/sell flow
    - Test dashboard → onboarding → complete checklist flow
    - Test dashboard → AI MRV → analyze project flow
    - Test first visit → consent banner → acceptance flow
    - _Requirements: All requirements_

  - [x] 31.2 Run full test suite
    - Execute all unit tests
    - Execute all integration tests
    - Review test coverage
    - _Requirements: All requirements_

  - [x] 31.3 Verify external integrations
    - Test CAD Trust API with real Project_UIDs
    - Verify fallback to mock data works
    - Test all external registry links
    - _Requirements: 5.2, 6.1, 6.5, 24.1, 24.2, 24.3, 24.4_

  - [x] 31.4 Verify data persistence
    - Test portfolio persistence across browser sessions
    - Test profile persistence across browser sessions
    - Test onboarding progress persistence
    - Test consent banner persistence
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

  - [x] 31.5 Accessibility audit
    - Test keyboard navigation on all pages
    - Verify ARIA labels on interactive elements
    - Check color contrast ratios
    - Test with screen reader (manual)
    - _Requirements: 2.5_

- [x] 32. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The implementation uses TypeScript throughout as specified in the design document
- CAD Trust API integration includes automatic fallback to mock data
- All data persistence uses browser localStorage (no backend required)
- The platform is optimized for Vercel deployment with Next.js 15
- Testing strategy focuses on unit tests and integration tests for critical flows
- Manual testing required for accessibility, responsive design, and external API verification
