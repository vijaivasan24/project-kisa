# Project Kisan - AI Agricultural Assistant

## Overview

Project Kisan is an AI-powered agricultural assistant designed to help small-scale farmers in India with crop disease diagnosis, market price tracking, government scheme navigation, and weather information. The application features a mobile-first design with voice interaction capabilities to overcome literacy barriers and provide instant expert help on demand.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for fast development and hot module replacement
- **UI System**: Shadcn/ui component library built on Radix UI primitives for accessible and consistent components
- **Styling**: Tailwind CSS with custom agricultural color scheme (farm green, harvest orange, trust blue)
- **State Management**: TanStack React Query for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Voice Interface**: Web Speech API integration for speech-to-text and text-to-speech functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js RESTful API architecture
- **Language**: TypeScript with ESM modules for modern JavaScript features
- **AI Integration**: Google Gemini 2.5 Flash model for multimodal image analysis and natural language processing
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: In-memory storage for development with PostgreSQL sessions planned for production

### Database Design
The application uses PostgreSQL with the following key entities:
- **Users**: Farmer profiles with location and language preferences
- **Disease Scans**: Historical crop disease diagnosis records with confidence scores
- **Market Prices**: Real-time commodity pricing data with trend analysis
- **Government Schemes**: Available subsidies and programs with eligibility criteria
- **Activities**: User interaction tracking for personalized recommendations

### Key Features Implementation

#### 1. Disease Diagnosis System
- Image upload via camera capture or file selection
- Base64 image encoding for API transmission
- Gemini Vision API integration for crop disease identification
- Confidence scoring and treatment recommendations
- Historical diagnosis storage for tracking patterns

#### 2. Market Intelligence
- Mock market data service with real-time pricing simulation
- Trend analysis with percentage changes and visual indicators
- AI-powered market insights using Gemini for natural language queries
- Multi-crop support for major Indian agricultural commodities

#### 3. Government Scheme Navigator
- Comprehensive scheme database with eligibility matching
- AI-powered recommendations based on farmer profiles
- Direct integration links to government application portals
- Status tracking for applications and approvals

#### 4. Voice Interface
- Speech recognition with Hindi and English support
- Natural language command processing
- Voice feedback using speech synthesis
- Accessibility features for low-literacy users

### Mobile-First Design
- Responsive layout optimized for smartphones
- Bottom navigation for easy thumb navigation
- Touch-friendly interface elements
- Progressive Web App capabilities for offline usage

## External Dependencies

### AI Services
- **Google Gemini API**: Primary AI service for image analysis, natural language processing, and conversational responses
- **Web Speech API**: Browser-native speech recognition and synthesis for voice interactions

### Database and Backend Services
- **PostgreSQL**: Primary database for persistent data storage
- **Neon Database**: Serverless PostgreSQL hosting service
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries

### UI and Frontend Libraries
- **Radix UI**: Headless component primitives for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **TanStack React Query**: Data fetching and caching library

### Third-Party Integrations
- **OpenWeatherMap API**: Weather data service (optional, with intelligent fallback)
- **Font Awesome**: Additional icon library for agricultural symbols
- **Google Fonts**: Web fonts for improved typography