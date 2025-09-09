# Project Kisan - AI Agricultural Assistant

## Overview

Project Kisan is a comprehensive AI-powered agricultural assistant designed to help small-scale farmers in India. The application provides instant crop disease diagnosis through image analysis, real-time market price information, government scheme recommendations, and weather-based farming advice. The system is built with a focus on accessibility, featuring voice-first interactions to overcome literacy barriers.

## Features

- **Disease Diagnosis**: Upload crop images for AI-powered disease detection with treatment recommendations
- **Market Intelligence**: Real-time crop price tracking and AI-generated market analysis
- **Government Schemes**: Search and recommendations for farming subsidies and programs
- **Voice Assistant**: AI-powered voice query processing in multiple languages
- **Weather Integration**: Location-based weather data and farming advice

## Technology Stack

### Frontend
- **Framework**: React with TypeScript and Vite
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom agricultural color scheme
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend
- **Runtime**: Node.js with Express.js RESTful API
- **Language**: TypeScript with ESM modules
- **AI Integration**: Google Gemini 2.5 Flash for multimodal analysis
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
- `users` - Farmer profiles and preferences
- `disease_scans` - Crop disease diagnosis history
- `market_prices` - Real-time commodity pricing data
- `government_schemes` - Available subsidies and programs
- `activities` - User interaction tracking

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vijaivasan24/project-kisa.git
   cd project-kisa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your values:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/project_kisan"
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Set up database**
   ```bash
   # Create database tables
   npm run db:push
   ```

5. **Start development servers**
   ```bash
   # Run both frontend and backend
   npm run dev:fullstack
   
   # Or run separately:
   npm run dev          # Backend only (port 9002)
   npm run dev:frontend # Frontend only (port 5000)
   ```

6. **Access the application**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:9002

### Getting API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

#### Database Setup
For local development, you can use:
- Local PostgreSQL installation
- Docker PostgreSQL container
- Cloud services like Neon, Supabase, or Railway

## Development Scripts

- `npm run dev:fullstack` - Run both frontend and backend
- `npm run dev` - Run backend only
- `npm run dev:frontend` - Run frontend only
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Sync database schema
- `npm run check` - Type checking

## API Endpoints

### Disease Diagnosis
- `POST /api/diagnose-disease` - Analyze crop disease from image

### Market Data
- `GET /api/market-prices` - Get current market prices
- `GET /api/market-prices/:crop` - Get price for specific crop
- `POST /api/market-insight` - Get AI market analysis

### Government Schemes
- `GET /api/schemes` - Get all available schemes
- `GET /api/schemes/search` - Search schemes
- `POST /api/schemes/recommend` - Get scheme recommendations

### Voice Assistant
- `POST /api/voice-query` - Process voice queries

### User Data
- `GET /api/activities/:userId` - Get user activities

### Weather
- `GET /api/weather?location=city` - Get weather data

## Production Deployment

The application is configured for production deployment with:

1. **Build process**: Vite builds frontend, esbuild bundles backend
2. **Static assets**: Frontend built to `dist/public`
3. **Server bundle**: Express server bundled to `dist/index.js`
4. **Environment**: Set `NODE_ENV=production`

### Build and Deploy
```bash
npm run build
npm run start
```

## Project Structure

```
project-kisa/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── services/          # Business logic
│   │   ├── gemini.ts     # AI service
│   │   ├── market.ts     # Market data
│   │   ├── schemes.ts    # Government schemes
│   │   └── weather.ts    # Weather service
│   ├── routes.ts         # API routes
│   ├── db.ts            # Database connection
│   └── index.ts         # Server entry point
├── shared/               # Shared types and schemas
└── migrations/          # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for farmers across India**