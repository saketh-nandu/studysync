# StudySync - All-in-One Student Application

## Overview

StudySync is a comprehensive web application designed to help students manage their academic life, productivity, and career development. Built with React, TypeScript, and Express.js, it provides a suite of tools including note-taking, flashcards, study timers, todo lists, and AI-powered assistance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **File Handling**: Multer for file uploads
- **AI Integration**: Google Gemini API for AI assistance

### Database Schema
The application uses a PostgreSQL database with the following main entities:
- **Users**: User authentication and profile information
- **Notes**: Text-based notes with tags and timestamps
- **Flashcards**: Deck-based flashcard system with JSON storage
- **Todos**: Task management with priorities and completion status
- **Projects**: Project tracking for career development
- **Schedules**: Calendar and scheduling functionality
- **Study Sessions**: Time tracking for study activities
- **News Feeds**: Content aggregation and sharing

## Key Components

### Authentication & Authorization
- Mock authentication system (currently uses hardcoded user ID)
- Session-based authentication structure in place
- User profile management capabilities

### Core Features
1. **Productivity Tools**
   - Pomodoro/Study Timer with session tracking
   - Todo List with priority management
   - Note Editor with rich text capabilities
   - Document Scanner (planned feature)

2. **Academic Tools**
   - Flashcard Creator with deck management
   - Formula reference library
   - Question banks for practice
   - Code playground integration
   - Dictionary lookup functionality

3. **Career Development**
   - Resume Builder with multiple templates
   - Job/Internship search integration
   - Scholarship tracking
   - Project portfolio management

4. **Utilities**
   - AI Chatbot for academic assistance
   - Document Converter (multiple formats)
   - QR Code Generator and Scanner
   - News feed aggregation
   - Attendance tracking

### UI/UX Design
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Navigation**: Sidebar for desktop, bottom navigation for mobile
- **Theming**: Light/dark mode support with CSS custom properties
- **Components**: Comprehensive component library based on Radix UI
- **Material Design**: Material Icons and design principles

## Data Flow

1. **Client-Server Communication**
   - REST API endpoints for all CRUD operations
   - JSON-based request/response format
   - React Query for caching and synchronization

2. **Database Operations**
   - Drizzle ORM for type-safe database queries
   - Connection pooling with Neon Database
   - Migrations managed through Drizzle Kit

3. **File Processing**
   - Multer middleware for file uploads
   - Document conversion capabilities
   - Local file storage with future cloud integration

4. **AI Integration**
   - Google Gemini API for chatbot functionality
   - Sentiment analysis capabilities
   - Article summarization features

## External Dependencies

### Core Libraries
- **React**: Frontend framework (v18+)
- **Express.js**: Backend framework
- **Drizzle ORM**: Database ORM with PostgreSQL
- **Neon Database**: Serverless PostgreSQL provider
- **React Query**: Server state management
- **Wouter**: Lightweight routing
- **Tailwind CSS**: Utility-first CSS framework

### UI Components
- **Radix UI**: Headless UI components
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Material Icons**: Google's icon set

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **ESLint & Prettier**: Code quality and formatting
- **PostCSS**: CSS processing

### External Services
- **Google Gemini API**: AI-powered assistance
- **Neon Database**: Cloud PostgreSQL hosting
- **Replit**: Development environment integration

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon Database with development credentials
- **Environment Variables**: DATABASE_URL, GEMINI_API_KEY

### Production Build
- **Frontend**: Vite build output to `dist/public`
- **Backend**: esbuild compilation to `dist/index.js`
- **Static Assets**: Served through Express static middleware
- **Database**: Production Neon Database instance

### Environment Configuration
- **Development**: `NODE_ENV=development` with tsx for TypeScript execution
- **Production**: `NODE_ENV=production` with compiled JavaScript
- **Database Migration**: Drizzle Kit for schema management
- **Type Checking**: Separate TypeScript compilation step

### Deployment Considerations
- Single-page application with client-side routing
- API routes under `/api` prefix
- Static file serving for production builds
- Database connection pooling for scalability
- Environment-specific configuration management