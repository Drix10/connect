# Requirements Document

## Introduction

Carbon Trade X is a comprehensive web platform for verifying, onboarding, and simulating high-quality carbon credits from major registries including Verra, Gold Standard, and India's CCTS. The platform integrates live registry data via the CAD Trust Data Model 2.0, provides educational content on carbon quality standards, guides users through registry onboarding processes, implements an AI-powered MRV multi-agent system, and includes a realistic trading simulator. The system operates as a demo-mode SaaS application with localStorage persistence, requiring no backend database or authentication infrastructure.

## Glossary

- **Platform**: The Carbon Trade X web application
- **CAD_Trust_API**: The Climate Action Data Trust public JSON-RPC v2.0 API endpoint at https://rpc.climateactiondata.org/v2
- **Registry**: A carbon credit registry system (Verra, Gold Standard, or CCTS)
- **Credit**: A verified carbon offset unit (VCU, VER, or CCC)
- **MRV**: Measurement, Reporting, and Verification process for carbon projects
- **User**: A person interacting with the Platform
- **Portfolio**: A User's collection of Credits stored in localStorage
- **Quality_Score**: A numerical rating from 0 to 100 indicating Credit quality
- **Project_UID**: A unique identifier for a carbon project in CAD Trust
- **Registry_ID**: A unique identifier for a Credit in its source Registry (Verra ID, Gold Standard ID, or CCTS ID)
- **AI_MRV_Agent**: The multi-agent AI system that analyzes carbon projects
- **Simulator**: The trading simulation environment within the Platform
- **KYC**: Know Your Customer verification process
- **Demo_Mode**: Operation mode where data persists only in browser localStorage without backend services

## Requirements

### Requirement 1: Platform Visual Design and Theming

**User Story:** As a User, I want a premium dark-themed interface with carbon-green accents, so that the Platform feels trustworthy and modern.

#### Acceptance Criteria

1. THE Platform SHALL use a dark theme with deep forest green primary color (#10b981) and secondary color (#166534)
2. THE Platform SHALL render all UI components using Tailwind CSS and shadcn/ui component library
3. THE Platform SHALL display icons using the Lucide icon library
4. THE Platform SHALL apply smooth animations using framer-motion library
5. THE Platform SHALL maintain consistent spacing, typography, and color usage across all pages

### Requirement 2: Navigation and Layout Structure

**User Story:** As a User, I want intuitive navigation with a sidebar and top navbar, so that I can easily access all Platform features.

#### Acceptance Criteria

1. THE Platform SHALL display a collapsible sidebar navigation on all authenticated pages
2. WHEN the viewport width is less than 768 pixels, THE Platform SHALL collapse the sidebar by default
3. THE Platform SHALL display a top navbar containing the logo "Carbon Trade X", a demo user avatar, and a "Live CAD Trust" badge
4. THE Platform SHALL display a footer containing DPDPA consent banner and links to Verra, Gold Standard, CAD Trust, and CCTS registries
5. THE Platform SHALL render all pages with responsive design that adapts to mobile, tablet, and desktop viewports

### Requirement 3: Landing Page Content

**User Story:** As a visitor, I want to understand the Platform's value proposition immediately, so that I can decide whether to explore further.

#### Acceptance Criteria

1. THE Platform SHALL display a hero section with the headline "Verify. Onboard. Trade. High-Quality Carbon Credits in One Place" on the landing page
2. THE Platform SHALL display a "How it Works" section explaining the Platform's three core functions
3. THE Platform SHALL display trust signals including logos and clickable links to Verra, Gold Standard, CAD Trust, and CCTS websites
4. THE Platform SHALL display a call-to-action button linking to the dashboard page
5. THE Platform SHALL display "Powered by CAD Trust Data Model 2.0" badge with a link to climateactiondata.org

### Requirement 4: Dashboard Overview

**User Story:** As a User, I want to see my portfolio summary and quick actions on the dashboard, so that I can quickly understand my current status.

#### Acceptance Criteria

1. THE Platform SHALL display a welcome card showing total verified carbon credits in tCO₂e units
2. THE Platform SHALL display potential portfolio value in Indian Rupees (₹)
3. THE Platform SHALL calculate portfolio metrics from Credits stored in localStorage
4. THE Platform SHALL display quick action buttons linking to Verify Credit, Onboarding, AI MRV, and Simulator pages
5. WHEN no Credits exist in localStorage, THE Platform SHALL display zero values with an onboarding prompt

### Requirement 5: Credit Verification Search

**User Story:** As a User, I want to search for carbon credits by their registry identifiers, so that I can verify their authenticity.

#### Acceptance Criteria

1. THE Platform SHALL display a search input accepting Verra ID, Gold Standard ID, or CAD Trust Project_UID
2. WHEN a User submits a search query, THE Platform SHALL call the CAD_Trust_API using JSON-RPC v2.0 protocol
3. THE Platform SHALL use the cadt_getProject method to retrieve project details from CAD_Trust_API
4. WHEN the CAD_Trust_API returns project data, THE Platform SHALL display project name, location, methodology, vintage, and issuance details
5. THE Platform SHALL display "View Full Registry" buttons with links to the original Registry pages

### Requirement 6: Credit Verification API Integration

**User Story:** As a User, I want the Platform to fetch live registry data, so that I can trust the verification results.

#### Acceptance Criteria

1. THE Platform SHALL send JSON-RPC v2.0 requests to https://rpc.climateactiondata.org/v2
2. WHEN the CAD_Trust_API request succeeds, THE Platform SHALL display a "Live from CAD Trust Data Model 2.0" badge
3. IF the CAD_Trust_API request fails, THEN THE Platform SHALL display realistic mock data with a "Demo Data" indicator
4. THE Platform SHALL implement a timeout of 10 seconds for CAD_Trust_API requests
5. WHEN the CAD_Trust_API returns an error response, THE Platform SHALL log the error and fall back to mock data

### Requirement 7: Carbon Quality Educational Content

**User Story:** As a User, I want to learn about carbon credit quality criteria, so that I can make informed decisions.

#### Acceptance Criteria

1. THE Platform SHALL display interactive tabs for MRV Process, Additionality, Permanence, Leakage Prevention, and Co-benefits
2. WHEN a User clicks a tab, THE Platform SHALL display detailed explanations in expandable cards
3. THE Platform SHALL provide definitions for technical terms within each quality criterion
4. THE Platform SHALL include visual diagrams or icons illustrating each quality concept
5. THE Platform SHALL maintain expanded/collapsed state of cards in component state during the session

### Requirement 8: Verra Registry Onboarding Guidance

**User Story:** As a User, I want step-by-step guidance for Verra onboarding, so that I can register my carbon project.

#### Acceptance Criteria

1. THE Platform SHALL display a Verra onboarding tab with a checklist of required steps
2. THE Platform SHALL provide checkboxes for each onboarding step that persist to localStorage
3. THE Platform SHALL display a progress bar showing completion percentage based on checked items
4. THE Platform SHALL provide mock file upload buttons for required documentation
5. WHEN all steps are checked, THE Platform SHALL enable a submit button that displays a success animation

### Requirement 9: Gold Standard Registry Onboarding Guidance

**User Story:** As a User, I want step-by-step guidance for Gold Standard onboarding, so that I can register my carbon project.

#### Acceptance Criteria

1. THE Platform SHALL display a Gold Standard onboarding tab with a checklist of required steps
2. THE Platform SHALL provide checkboxes for each onboarding step that persist to localStorage
3. THE Platform SHALL display a progress bar showing completion percentage based on checked items
4. THE Platform SHALL provide mock file upload buttons for required documentation
5. WHEN all steps are checked, THE Platform SHALL enable a submit button that displays a success animation

### Requirement 10: AI MRV Multi-Agent System Interface

**User Story:** As a User, I want to analyze carbon projects using AI agents, so that I can assess project quality automatically.

#### Acceptance Criteria

1. THE Platform SHALL display a chat-like interface for AI_MRV_Agent interactions
2. WHEN a User inputs a project description or Registry_ID, THE Platform SHALL initiate the AI_MRV_Agent analysis
3. THE Platform SHALL display agent activity indicators showing which agent is currently processing
4. THE Platform SHALL stream or display sequential outputs from each of the four agents
5. WHEN analysis completes, THE Platform SHALL display a summary report with a Quality_Score from 0 to 100

### Requirement 11: AI MRV Researcher Agent

**User Story:** As a User, I want the Researcher agent to fetch project data, so that the analysis is based on real registry information.

#### Acceptance Criteria

1. WHEN the AI_MRV_Agent receives a Registry_ID, THE Researcher agent SHALL call the CAD_Trust_API to retrieve project details
2. THE Researcher agent SHALL extract project methodology, location, vintage, and issuance data
3. IF the CAD_Trust_API call fails, THEN THE Researcher agent SHALL use the provided project description
4. THE Researcher agent SHALL output structured project data for subsequent agents
5. THE Platform SHALL display the Researcher agent's findings in the chat interface

### Requirement 12: AI MRV Verifier Agent

**User Story:** As a User, I want the Verifier agent to assess additionality and permanence, so that I understand project quality.

#### Acceptance Criteria

1. WHEN the Researcher agent completes, THE Verifier agent SHALL analyze project additionality based on methodology
2. THE Verifier agent SHALL assess permanence risk based on project type and location
3. THE Verifier agent SHALL evaluate leakage prevention measures
4. THE Verifier agent SHALL output additionality score, permanence score, and leakage score
5. THE Platform SHALL display the Verifier agent's assessment in the chat interface

### Requirement 13: AI MRV Compliance Checker Agent

**User Story:** As a User, I want the Compliance Checker to identify regulatory issues, so that I can address compliance gaps.

#### Acceptance Criteria

1. WHEN the Verifier agent completes, THE Compliance Checker agent SHALL review project against Verra VCS standards
2. THE Compliance Checker agent SHALL review project against Gold Standard requirements
3. THE Compliance Checker agent SHALL flag any missing documentation or methodology gaps
4. THE Compliance Checker agent SHALL output a list of compliance issues or a confirmation of compliance
5. THE Platform SHALL display the Compliance Checker agent's findings in the chat interface

### Requirement 14: AI MRV Report Generator Agent

**User Story:** As a User, I want a comprehensive quality report, so that I can make informed trading decisions.

#### Acceptance Criteria

1. WHEN the Compliance Checker agent completes, THE Report Generator agent SHALL synthesize all agent outputs
2. THE Report Generator agent SHALL calculate an overall Quality_Score from 0 to 100
3. THE Report Generator agent SHALL generate a summary report including strengths and weaknesses
4. THE Report Generator agent SHALL provide recommendations for project improvement
5. THE Platform SHALL display the final report with the Quality_Score prominently highlighted

### Requirement 15: Trading Simulator Marketplace Display

**User Story:** As a User, I want to browse available carbon credits in the simulator, so that I can practice trading.

#### Acceptance Criteria

1. THE Simulator SHALL display a table of 8 realistic sample Credits including Verra VCUs, Gold Standard VERs, and CCTS CCCs
2. THE Simulator SHALL display for each Credit: Registry_ID, project name, price per tCO₂e, available volume, and Quality_Score
3. THE Simulator SHALL allow sorting the table by price, volume, or Quality_Score
4. THE Simulator SHALL display a "Buy" button for each Credit in the marketplace
5. THE Simulator SHALL update the marketplace table when Credits are purchased

### Requirement 16: Trading Simulator Portfolio Management

**User Story:** As a User, I want to manage my simulated portfolio, so that I can track my trading activity.

#### Acceptance Criteria

1. THE Simulator SHALL display the User's Portfolio showing owned Credits with quantity and purchase price
2. THE Simulator SHALL persist Portfolio data to localStorage
3. THE Simulator SHALL calculate total Portfolio value based on current market prices
4. THE Simulator SHALL display a "Sell" button for each Credit in the Portfolio
5. WHEN a User sells a Credit, THE Simulator SHALL return it to the marketplace and update Portfolio value

### Requirement 17: Trading Simulator Transaction Execution

**User Story:** As a User, I want to execute buy and sell transactions, so that I can simulate real trading activity.

#### Acceptance Criteria

1. WHEN a User clicks a "Buy" button, THE Simulator SHALL add the Credit to the Portfolio with current timestamp
2. WHEN a User clicks a "Sell" button, THE Simulator SHALL remove the Credit from the Portfolio
3. THE Simulator SHALL display a toast notification confirming each transaction
4. THE Simulator SHALL update localStorage immediately after each transaction
5. THE Simulator SHALL prevent buying a Credit that is already in the Portfolio

### Requirement 18: Trading Simulator Price Visualization

**User Story:** As a User, I want to see price trends, so that I can understand market dynamics.

#### Acceptance Criteria

1. THE Simulator SHALL display a line chart showing simulated price history for selected Credits
2. THE Simulator SHALL use the Recharts library to render the price chart
3. WHEN a User selects a Credit from the marketplace, THE Simulator SHALL update the chart to show that Credit's price history
4. THE Simulator SHALL generate realistic mock price data with daily granularity for the past 30 days
5. THE Simulator SHALL display price in Indian Rupees (₹) per tCO₂e on the y-axis and dates on the x-axis

### Requirement 19: User Profile and KYC Display

**User Story:** As a User, I want to view my profile and KYC status, so that I understand my account standing.

#### Acceptance Criteria

1. THE Platform SHALL display a mock KYC form with fields for name, email, organization, and country
2. THE Platform SHALL persist profile data to localStorage
3. THE Platform SHALL display a "Demo Account — KYC Approved" badge
4. THE Platform SHALL provide an editable API key field for CAD Trust integration
5. THE Platform SHALL save the API key to localStorage when the User updates it

### Requirement 20: Data Persistence in Demo Mode

**User Story:** As a User, I want my data to persist across sessions, so that I can continue where I left off.

#### Acceptance Criteria

1. THE Platform SHALL store Portfolio data in browser localStorage
2. THE Platform SHALL store onboarding checklist progress in browser localStorage
3. THE Platform SHALL store profile information in browser localStorage
4. WHEN the Platform loads, THE Platform SHALL retrieve all persisted data from localStorage
5. THE Platform SHALL handle localStorage quota exceeded errors by displaying a warning message

### Requirement 21: Error Handling and Loading States

**User Story:** As a User, I want clear feedback during loading and errors, so that I understand what the Platform is doing.

#### Acceptance Criteria

1. WHEN the Platform is fetching data, THE Platform SHALL display a loading spinner or skeleton screen
2. WHEN an API request fails, THE Platform SHALL display an error message with retry option
3. WHEN localStorage is unavailable, THE Platform SHALL display a warning and operate in memory-only mode
4. THE Platform SHALL implement error boundaries to catch React component errors
5. WHEN an unexpected error occurs, THE Platform SHALL display a user-friendly error message with contact information

### Requirement 22: CAD Trust Attribution and Branding

**User Story:** As a User, I want to see CAD Trust attribution, so that I understand the data source.

#### Acceptance Criteria

1. THE Platform SHALL display "Powered by CAD Trust Data Model 2.0" badges on pages using CAD_Trust_API data
2. THE Platform SHALL provide clickable links to climateactiondata.org from all CAD Trust badges
3. THE Platform SHALL display "Live from CAD Trust Data Model 2.0" indicator when showing real API data
4. THE Platform SHALL display "Demo Data" indicator when showing fallback mock data
5. THE Platform SHALL include CAD Trust logo in the footer with attribution text

### Requirement 23: DPDPA Compliance and Consent

**User Story:** As a User, I want to understand data privacy practices, so that I can make informed consent decisions.

#### Acceptance Criteria

1. THE Platform SHALL display a DPDPA consent banner in the footer on first visit
2. THE Platform SHALL explain that data is stored only in browser localStorage
3. THE Platform SHALL provide a link to a privacy policy page explaining data handling
4. WHEN a User accepts the consent banner, THE Platform SHALL store consent status in localStorage
5. THE Platform SHALL not display the consent banner on subsequent visits after acceptance

### Requirement 24: External Registry Links

**User Story:** As a User, I want to access official registry websites, so that I can verify information independently.

#### Acceptance Criteria

1. THE Platform SHALL provide clickable links to verra.org for Verra Credits
2. THE Platform SHALL provide clickable links to goldstandard.org for Gold Standard Credits
3. THE Platform SHALL provide clickable links to the CCTS registry for CCTS Credits
4. THE Platform SHALL provide a clickable link to climateactiondata.org for CAD Trust information
5. THE Platform SHALL open all external registry links in a new browser tab

### Requirement 25: Technology Stack Implementation

**User Story:** As a developer, I want the Platform built with modern technologies, so that it is maintainable and performant.

#### Acceptance Criteria

1. THE Platform SHALL be implemented using Next.js 15 with App Router architecture
2. THE Platform SHALL be implemented using TypeScript for type safety
3. THE Platform SHALL use Tailwind CSS for styling
4. THE Platform SHALL use shadcn/ui for UI components
5. THE Platform SHALL use Vercel AI SDK for AI_MRV_Agent implementation

### Requirement 26: Deployment Readiness

**User Story:** As a developer, I want the Platform ready for one-click deployment, so that I can launch quickly.

#### Acceptance Criteria

1. THE Platform SHALL include a valid package.json with all dependencies
2. THE Platform SHALL include a next.config.js or next.config.ts configuration file
3. THE Platform SHALL include a README.md with setup and deployment instructions
4. THE Platform SHALL include a .gitignore file excluding node_modules and build artifacts
5. THE Platform SHALL build successfully with the command "npm run build" without errors

### Requirement 27: Code Quality and Documentation

**User Story:** As a developer, I want clean, documented code, so that I can maintain and extend the Platform.

#### Acceptance Criteria

1. THE Platform SHALL include TypeScript type definitions for all components and functions
2. THE Platform SHALL include code comments explaining complex logic
3. THE Platform SHALL follow consistent naming conventions across all files
4. THE Platform SHALL organize components into logical directory structures
5. THE Platform SHALL include JSDoc comments for exported functions and components

### Requirement 28: Mock Data Fallback System

**User Story:** As a User, I want the Platform to work even when external APIs are unavailable, so that I can always explore features.

#### Acceptance Criteria

1. THE Platform SHALL include realistic mock data for Verra, Gold Standard, and CCTS Credits
2. WHEN the CAD_Trust_API is unavailable, THE Platform SHALL use mock project data
3. THE Platform SHALL include mock data for at least 8 different carbon projects
4. THE Platform SHALL ensure mock data follows the same structure as real CAD_Trust_API responses
5. THE Platform SHALL clearly indicate when displaying mock data versus live data
