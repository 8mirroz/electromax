# Product Requirements Document (PRD) - Electromax v1

## 1. Product Overview

**Electromax** is a modern B2B lead-generation and marketing website for an engineering systems integration company. It acts as the primary digital touchpoint for clients needing services like Fire Alarms (APS), Video Surveillance (SOT), Access Control (SKUD), and Electrical Installation (EOM). The goal is to capture high-quality leads through SEO-optimized service landing pages featuring interactive cost calculators, structured service offerings, and trust-building components (cases, licenses).

## 2. Target Audience

- **Primary:** B2B Clients (Facility Managers, Business Owners, General Contractors) needing engineering systems for offices, warehouses, manufacturing plants, and retail centers.
- **Secondary:** B2C Clients (Private Homeowners) needing smart home or complex security installations.

## 3. Core Requirements

### 3.1. Landing Page Architecture [REQ-001]

Each service (APS, SKUD, etc.) must have its own dedicated landing page based on a universal master template.

- **Given** a user navigates to `/services/aps/`
- **When** the page loads
- **Then** the user must see a structured page containing: Hero, Calculator, Problems, Included Steps, Packages, Equipment, Pricing, Process, Cases, Licenses, FAQ, and a Request Form.
- **And** the page must have sticky anchor navigation for these sections.

### 3.2. Interactive Cost Calculator [REQ-002]

A mini-calculator to provide instant price estimates and capture leads.

- **Given** a user interacts with the calculator on a service page
- **When** they input object type, area (sqm), number of rooms, and required systems
- **Then** the system instantly calculates an estimated price range using the formula: `base_price * area * complexity_coef`.
- **And** prompts the user to submit their contact info to lock in the estimate.

### 3.3. Lead Capture & CRM Integration [REQ-003]

Robust lead capture mechanisms integrated with company systems.

- **Given** a user submits a request form or calculator form
- **When** the submission is successful
- **Then** the system must capture: name, phone, email, area, object type, estimated price, and UTM tags.
- **And** the payload must be dispatched to the internal CRM, an Email address, and a Telegram Bot for instant notification to managers.

### 3.4. Component-Driven UI [REQ-004]

The UI must be built using reusable React components to ensure consistency across all service pages.

- Components include: `HeroBanner`, `FormModal`, `StepForm` (Calculator), `ProblemCards`, `PricingCards`, `ProcessTimeline`, `CaseGallery`, `AccordionFAQ`, etc.

### 3.5. SEO & Analytics [REQ-005]

The platform must be optimized for search engines and track user engagement.

- **Given** a service page is rendered
- **Then** it must include dynamic Meta Title/Description and Schema.org markup (`LocalBusiness`, `Service`, `FAQPage`).
- **And** analytics events (`form_submit`, `calculator_complete`, `scroll_50`, `whatsapp_click`) must be tracked via Google Analytics / Yandex Metrika.

## 4. Non-Functional Requirements

- **Performance:** Pages must load quickly, optimized by Next.js App Router (Server Components where applicable).
- **Responsive Design:** Mobile-first approach with sticky CTAs, simplified calculators, and quick-call/WhatsApp buttons.
- **Extensibility:** Multi-language support structure (`/ru/`, `/en/`) should be considered in routing.

## 5. Scope of v1

- Implementation of the Core Next.js + Tailwind CSS marketing platform.
- Development of the Universal Landing Page Template and core UI components.
- Creation of at least one initial service landing page (e.g., `/services/aps/`) as a proof-of-concept.
- Basic Lead capture sending to Telegram/Email (CRM integration via API endpoints).
