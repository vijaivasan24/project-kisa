# Project Kisan - AI Agricultural Assistant

## Overview

Project Kisan is a comprehensive AI-powered agricultural assistant designed to help small-scale farmers in India. The application provides instant crop disease diagnosis through image analysis, real-time market price information, government scheme recommendations, and weather-based farming advice. The system is built with a focus on accessibility, featuring voice-first interactions to overcome literacy barriers.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom agricultural color scheme
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Voice Interface**: Web Speech API for speech recognition and synthesis

### Backend Architecture
- **Runtime**: Node.js with Express.js RESTful API
- **Language**: TypeScript with ESM modules
- **AI Integration**: Google Gemini 2.5 Pro for multimodal analysis
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with plans for PostgreSQL sessions

### Database Design
The application uses PostgreSQL with the following key tables:
- `users` - Farmer profiles and preferences
- `disease_scans` - Crop disease diagnosis history
- `market_prices` - Real-time commodity pricing data
- `government_schemes` - Available subsidies and programs
- `activities` - User interaction tracking

## Key Components

### 1. Disease Diagnosis System
- **Image Upload**: Camera capture or file upload functionality
- **AI Analysis**: Gemini Vision API for crop disease identification
- **Results Display**: Confidence scores, treatment recommendations, and severity assessment
- **History Tracking**: Stored diagnosis results for future reference

### 2. Market Intelligence
- **Price Data**: Real-time commodity pricing with trend analysis
- **Market Insights**: AI-generated market analysis and recommendations
- **Multi-Crop Support**: Coverage for major Indian agricultural commodities

### 3. Government Scheme Navigator
- **Scheme Database**: Comprehensive government program information
- **Eligibility Matching**: AI-powered scheme recommendations based on farmer profiles
- **Application Links**: Direct integration with government portals

### 4. Voice Interface
- **Multi-Language Support**: English and Indian languages (Hindi, Kannada, Telugu)
- **Speech Recognition**: Web Speech API for voice commands
- **Text-to-Speech**: Audio feedback for low-literacy users
- **Command Processing**: Natural language intent recognition

### 5. Weather Integration
- **Current Conditions**: Temperature, humidity, rainfall data
- **Farming Advice**: Weather-based agricultural recommendations
- **Location-Based**: Geographically relevant information

## Data Flow

1. **User Authentication**: Simple username-based system with future expansion for proper authentication
2. **Image Processing**: Client uploads → Base64 encoding → Gemini API → Results storage
3. **Market Data**: External API integration → Real-time pricing → Trend analysis
4. **Voice Commands**: Speech input → Intent recognition → Action routing → Audio response
5. **Database Operations**: Drizzle ORM → PostgreSQL → Structured data storage

## External Dependencies

### AI and ML Services
- **Google Gemini API**: Multimodal AI for image analysis and text generation
- **Web Speech API**: Browser-native speech recognition and synthesis

### Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations

### UI and Styling
- **Shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **TanStack React Query**: Server state management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Environment Variables**: DATABASE_URL and GEMINI_API_KEY required
- **Database Migrations**: Drizzle Kit for schema management

### Production Deployment
- **Build Process**: Vite builds client, esbuild bundles server
- **Static Assets**: Client built to `dist/public`
- **Server Bundle**: Express server bundled to `dist/index.js`
- **Database**: Neon PostgreSQL with connection pooling

### Environment Configuration
- **Development**: `NODE_ENV=development` with tsx for TypeScript execution
- **Production**: `NODE_ENV=production` with compiled JavaScript
- **Database**: Automated migrations through `drizzle-kit push`

## Changelog
- Aug 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
