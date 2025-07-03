# Ultimate Blueprint Pilot

> Cockpit for designing micro-engineered blueprints

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Overview

Ultimate Blueprint Pilot is a comprehensive web application designed to help developers create structured blueprints for their software projects. Built with modern web technologies and following the Barton Doctrine principles, it provides a systematic approach to project planning and development.

### Key Features

- **7-Phase Blueprint Methodology**: Structured approach to project design
- **Interactive Phase Tracking**: Real-time progress monitoring
- **Prompt Library**: Curated collection of development prompts
- **Re-engineering Mode**: Analyze existing GitHub repositories
- **Comprehensive Error Handling**: Robust error boundaries and user feedback
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks + Context API
- **Error Handling**: Custom Error Boundaries
- **Notifications**: Context-based notification system

### Project Structure

```
ultimate-blueprint-pilot/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Main application page
│   │   ├── prompts/           # Prompts library page
│   │   └── reengineer/        # Re-engineering mode page
│   ├── components/            # React components
│   │   ├── ErrorBoundary.tsx  # Error handling component
│   │   ├── LoadingSpinner.tsx # Loading states
│   │   ├── NotificationSystem.tsx # User notifications
│   │   ├── PhaseSection.tsx   # Individual phase component
│   │   └── PhaseTracker.tsx   # Main phase tracking
│   ├── lib/                   # Utility libraries
│   │   ├── constants.ts       # Application constants
│   │   └── utils.ts           # Helper functions
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Core application types
│   └── styles/                # Global styles
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/djb258/ulimate-blueprint-pilot.git
   cd ulimate-blueprint-pilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run archive-build` - Build and archive with timestamp

## 📋 Blueprint Phases

The application follows a structured 7-phase methodology:

### 1. PLAN
- **Duration**: 2 hours
- **Focus**: Project scope, requirements, and high-level architecture
- **Deliverables**: Requirements specification, architecture overview, technology decisions log

### 2. SCAFFOLD
- **Duration**: 1.5 hours
- **Focus**: Project setup and initial configuration
- **Deliverables**: Initialized project structure, configuration files, development environment guide

### 3. FILE STRUCTURE
- **Duration**: 1 hour
- **Focus**: Codebase organization and directory structure
- **Deliverables**: Directory structure diagram, naming convention guide, module organization plan

### 4. TEST PLAN
- **Duration**: 1.5 hours
- **Focus**: Testing strategy and coverage requirements
- **Deliverables**: Testing strategy document, coverage configuration, CI/CD pipeline setup

### 5. SECURITY PLAN
- **Duration**: 2 hours
- **Focus**: Security measures and best practices
- **Deliverables**: Security implementation guide, authentication setup, authorization configuration

### 6. PHASE GATES / PROMOTION RULES
- **Duration**: 1 hour
- **Focus**: Deployment and promotion criteria
- **Deliverables**: Deployment pipeline configuration, environment setup guide, promotion criteria document

### 7. FINALIZE BLUEPRINT
- **Duration**: 1.5 hours
- **Focus**: Documentation completion and final review
- **Deliverables**: Complete documentation, code review checklist, deployment guide

## 🎯 Core Features

### Phase Tracking
- Interactive phase management with real-time status updates
- Dependency tracking between phases
- Progress visualization with completion percentages
- Detailed phase requirements and deliverables

### Error Handling
- Comprehensive error boundaries for component-level error catching
- User-friendly error messages with retry options
- Development mode error details for debugging
- Graceful degradation for unexpected errors

### Notification System
- Context-based notification management
- Multiple notification types (success, error, warning, info)
- Auto-dismiss functionality with configurable timing
- Persistent notification state management

### Loading States
- Multiple loading spinner variants
- Skeleton loading for content placeholders
- Progress bars for long-running operations
- Loading overlays for component-level loading

## 🔧 Development

### Code Style

This project follows strict TypeScript and ESLint configurations:

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Next.js recommended rules with custom configurations
- **Prettier**: Consistent code formatting
- **Import Organization**: Structured imports with proper grouping

### Component Architecture

Components are built following React best practices:

- **Functional Components**: Modern React with hooks
- **TypeScript Interfaces**: Comprehensive type definitions
- **Props Validation**: Strict prop typing and validation
- **Error Boundaries**: Component-level error handling
- **Loading States**: Consistent loading patterns

### State Management

- **Local State**: React useState for component-level state
- **Context API**: Global state for notifications and app-wide data
- **Custom Hooks**: Reusable state logic and side effects
- **Event Handlers**: Proper event handling with TypeScript

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Deploy automatically** on every push to main branch

### Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm run start
   ```

### Environment Variables

Create a `.env.local` file for local development:

```env
# Application
NEXT_PUBLIC_APP_NAME="Ultimate Blueprint Pilot"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# External Services
NEXT_PUBLIC_GITHUB_API_URL="https://api.github.com"
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Test thoroughly** with the development server
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- **TypeScript**: Use strict typing and avoid `any` types
- **Components**: Follow functional component patterns
- **Error Handling**: Implement proper error boundaries
- **Testing**: Add tests for new features
- **Documentation**: Update README and add JSDoc comments

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the component library
- **TypeScript Team** for the type system

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/djb258/ulimate-blueprint-pilot/issues)
- **Email**: support@ultimate-blueprint-pilot.com
- **Documentation**: [Project Wiki](https://github.com/djb258/ulimate-blueprint-pilot/wiki)

## 🔗 Links

- **Live Demo**: [https://ulimate-blueprint-pilot.vercel.app](https://ulimate-blueprint-pilot.vercel.app)
- **GitHub Repository**: [https://github.com/djb258/ulimate-blueprint-pilot](https://github.com/djb258/ulimate-blueprint-pilot)
- **Author**: [djb258](https://github.com/djb258)

---

**Built with ❤️ by djb258**

*Ultimate Blueprint Pilot - Making software development more structured and efficient.*
