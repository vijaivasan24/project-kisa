# AI-Powered Farming Assistant

## Project Overview
This is a full-stack farming assistant application that provides AI-powered services for farmers including crop disease detection, market price tracking, government schemes information, and weather data.

## Technology Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Services**: Google Gemini AI
- **UI Components**: Radix UI + shadcn/ui

## Architecture
- **Client**: React SPA in `/client` folder served on port 5000
- **Server**: Express API in `/server` folder running on port 9002
- **Shared**: Common types and schemas in `/shared` folder
- **Proxy Setup**: Vite dev server proxies `/api` requests to backend

## Key Features
1. **Disease Scanner**: Upload crop images for AI-powered disease detection
2. **Market Prices**: Real-time crop price tracking and market analysis
3. **Government Schemes**: Search and recommendations for farming subsidies
4. **Weather Information**: Location-based weather data
5. **Voice Assistant**: AI-powered voice query processing

## Development Setup
The application is configured to run in Replit environment with:
- Frontend accessible at port 5000 (configured for Replit proxy)
- Backend API on port 9002
- PostgreSQL database integration ready
- Hot reload enabled for both frontend and backend

## Recent Changes
- Configured Vite to allow all hosts for Replit proxy compatibility
- Set up full-stack development workflow
- Configured deployment settings for Autoscale
- Application is running and functional with mock data services

## User Preferences
- Full-stack TypeScript development
- Modern React patterns with hooks
- Tailwind CSS for styling
- RESTful API design
- Component-based architecture

## Project Status
✅ Development environment configured
✅ Frontend and backend servers running
✅ API endpoints functional
✅ Deployment configuration set
⏳ Database connection pending (using mock services)