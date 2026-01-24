<div align="center">

# 🎨 Complyx Client

### Next.js Frontend Application

**Modern, Responsive, and Feature-Rich User Interface**

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Component Architecture](#-component-architecture)
- [State Management](#-state-management)
- [Styling & Theming](#-styling--theming)
- [Testing](#-testing)
- [Performance](#-performance)
- [Deployment](#-deployment)

---

## 🎯 Overview

The Complyx Client is a modern, responsive Next.js application that provides an intuitive interface for IFRS S1 & S2 compliance assessment. Built with TypeScript, Tailwind CSS, and React, it offers a seamless user experience with real-time updates, dark mode support, and comprehensive dashboard analytics.

### Key Highlights

- ⚡ **Fast Performance**: Optimized with Next.js 14 App Router
- 🎨 **Beautiful UI**: Modern design with glassmorphism effects
- 🌙 **Dark Mode**: Full dark mode support across all components
- 📱 **Responsive**: Mobile-first, fully responsive design
- 🔄 **Real-Time**: Live data synchronization and updates
- ♿ **Accessible**: WCAG 2.1 AA compliant

---

## ✨ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Chat Interface** | Interactive conversational assessment | ✅ Complete |
| **Dashboard** | Real-time compliance metrics and analytics | ✅ Complete |
| **Assessment Flow** | Multi-phase assessment system | ✅ Complete |
| **Gap Analysis** | Visual gap identification and prioritization | ✅ Complete |
| **Compliance Matrix** | Interactive requirement compliance tracking | ✅ Complete |
| **Report Export** | PDF and Excel report generation | ✅ Complete |
| **Authentication** | Secure login and user management | ✅ Complete |
| **Admin Panel** | User management and system analytics | ✅ Complete |

### UI/UX Features

- 🎨 **Glassmorphism Design**: Modern glass-effect containers
- 🌈 **Animated Gradients**: Smooth gradient animations
- 🎭 **Micro-interactions**: Delightful hover and click animations
- 📊 **Interactive Charts**: Recharts-powered data visualizations
- 🔔 **Toast Notifications**: User-friendly feedback system
- 🎯 **Loading States**: Elegant loading indicators
- 🚫 **Error Handling**: Comprehensive error boundaries

---

## 🛠️ Tech Stack

### Core Technologies

```yaml
Framework: Next.js 14.1.0
Language: TypeScript 5.3.3
UI Library: React 18.2.0
Styling: Tailwind CSS 3.4.1
State Management: Zustand 5.0.10
Animations: Framer Motion 11.0.0
Charts: Recharts 3.6.0
Markdown: React Markdown 10.1.0
PDF Generation: jsPDF 4.0.0
Excel Export: xlsx 0.18.5
```

### Development Tools

- **TypeScript**: Type safety and better DX
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:

```env
# API URL - Backend server URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Cloudflare R2 Public URL (optional)
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=

# Node Environment
NODE_ENV=development
```

### Development Server

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

---

## 📁 Project Structure

```
client/
├── 📂 app/                        # Next.js App Router
│   ├── 📂 (routes)/               # Route groups
│   │   ├── 📄 page.tsx           # Home page
│   │   ├── 📄 layout.tsx         # Root layout
│   │   ├── 📄 loading.tsx         # Loading UI
│   │   ├── 📄 error.tsx          # Error boundary
│   │   └── 📄 not-found.tsx      # 404 page
│   ├── 📂 dashboard/              # Dashboard pages
│   ├── 📂 auth/                   # Authentication pages
│   ├── 📂 admin/                  # Admin panel pages
│   └── 📂 test-chat/              # Chat testing page
│
├── 📂 components/                 # React Components
│   ├── 📂 chat/                   # Chat interface
│   │   ├── ChatInterface.tsx
│   │   ├── ChatInput.tsx
│   │   └── MessageBubble.tsx
│   ├── 📂 dashboard/              # Dashboard components
│   │   ├── ReadinessScore.tsx
│   │   ├── ProgressCharts.tsx
│   │   └── GapAnalysis.tsx
│   ├── 📂 assessment/             # Assessment components
│   ├── 📂 auth/                   # Authentication components
│   ├── 📂 layout/                 # Layout components
│   ├── 📂 ui/                      # UI component library
│   └── 📂 providers/              # Context providers
│
├── 📂 lib/                        # Utilities and helpers
│   ├── 📂 api/                    # API client functions
│   ├── 📂 reports/                # Report generation
│   └── 📂 utils/                  # Utility functions
│
├── 📂 stores/                     # Zustand state stores
│   ├── authStore.ts
│   ├── chatStore.ts
│   └── assessmentStore.ts
│
├── 📂 hooks/                      # Custom React hooks
│   ├── useDashboardApi.ts
│   ├── useMediaQuery.ts
│   └── usePageLoading.ts
│
├── 📂 public/                     # Static assets
├── 📄 next.config.js              # Next.js configuration
├── 📄 tailwind.config.js          # Tailwind configuration
└── 📄 tsconfig.json               # TypeScript configuration
```

---

## 🧩 Component Architecture

### Component Organization

Components are organized by feature and follow a modular approach:

```
ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentNameContainer.tsx # Container with styling
├── ComponentNameHeader.tsx    # Header section
├── ComponentNameContent.tsx   # Content section
└── index.ts                   # Exports
```

### Component Patterns

#### 1. Container Components

```typescript
// Example: ReadinessScoreContainer.tsx
export default function ReadinessScoreContainer({ children }) {
  return (
    <motion.div className="glassmorphism-container">
      {/* Glassmorphism background */}
      {/* Animated gradients */}
      {/* Content */}
      {children}
    </motion.div>
  );
}
```

#### 2. Presentational Components

```typescript
// Example: ReadinessScore.tsx
export function ReadinessScore({ scores, userId }) {
  const { data, isLoading } = useDashboardApi(/* ... */);
  
  return (
    <ReadinessScoreContainer>
      <ReadinessScoreHeader />
      <ReadinessScoreContent data={data} />
    </ReadinessScoreContainer>
  );
}
```

#### 3. Custom Hooks

```typescript
// Example: useDashboardApi.ts
export function useDashboardApi(params) {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => DashboardAPI.getDashboardData(params),
  });
}
```

---

## 🗄️ State Management

### Zustand Stores

We use Zustand for client-side state management:

#### Auth Store

```typescript
// stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => { /* ... */ },
      logout: async () => { /* ... */ },
    }),
    { name: 'auth-storage' }
  )
);
```

#### Chat Store

```typescript
// stores/chatStore.ts
export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
}));
```

### Server State (React Query)

For server state, we use React Query:

```typescript
// hooks/useDashboardApi.ts
export function useDashboardData(params) {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => DashboardAPI.getDashboardData(params),
    staleTime: 30000, // 30 seconds
  });
}
```

---

## 🎨 Styling & Theming

### Tailwind CSS

We use Tailwind CSS for styling with a custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        accent: { /* ... */ },
      },
    },
  },
}
```

### Dark Mode

Dark mode is implemented using:

1. **Theme Provider**: `components/providers/ThemeProvider.tsx`
2. **Theme Toggle**: `components/layout/HeaderThemeToggle.tsx`
3. **CSS Classes**: `dark:` prefix for dark mode styles

```typescript
// Example dark mode styling
<div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">
  Content
</div>
```

### Design System

#### Colors

- **Primary**: Teal/Green tones for main actions
- **Accent**: Complementary colors for highlights
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Success, Warning, Error colors

#### Typography

- **Headings**:** Inter font, bold weights
- **Body**: System font stack
- **Code**: Monospace font

#### Spacing

- Consistent spacing scale (4px base unit)
- Responsive spacing utilities

---

## 🧪 Testing

### Testing Strategy

We follow industry best practices for frontend testing:

#### 1. Unit Testing

Test individual components in isolation:

```typescript
// __tests__/components/ReadinessScore.test.tsx
import { render, screen } from '@testing-library/react';
import { ReadinessScore } from '@/components/dashboard/ReadinessScore';

describe('ReadinessScore', () => {
  it('should render score correctly', () => {
    const scores = { overallScore: 85 };
    render(<ReadinessScore scores={scores} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
```

#### 2. Integration Testing

Test component interactions:

```typescript
// __tests__/integration/Dashboard.test.tsx
describe('Dashboard Integration', () => {
  it('should fetch and display dashboard data', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Readiness Score')).toBeInTheDocument();
    });
  });
});
```

#### 3. E2E Testing

Test complete user workflows:

```typescript
// e2e/dashboard.spec.ts
test('user can view dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('text=Readiness Score')).toBeVisible();
});
```

### Testing Tools

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### Test Coverage Goals

| Component Type | Target Coverage |
|----------------|----------------|
| **UI Components** | > 80% |
| **Hooks** | > 90% |
| **Utilities** | > 95% |
| **API Clients** | > 85% |

### Testing Best Practices

1. **Test User Behavior**: Focus on what users see and do
2. **Avoid Testing Implementation**: Test outcomes, not internals
3. **Use Accessible Queries**: Prefer `getByRole`, `getByLabelText`
4. **Mock External Dependencies**: Mock API calls and services
5. **Test Error States**: Include error and loading states
6. **Keep Tests Fast**: Optimize for quick feedback
7. **Maintain Test Data**: Use factories for test data

### Example Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Mock dependencies
  });

  // Happy path
  describe('when data is loaded', () => {
    it('should render correctly', () => {
      // Test implementation
    });
  });

  // Error states
  describe('when error occurs', () => {
    it('should display error message', () => {
      // Test implementation
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it('should handle empty data', () => {
      // Test implementation
    });
  });
});
```

---

## ⚡ Performance

### Optimization Strategies

#### 1. Code Splitting

```typescript
// Lazy load components
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'));
```

#### 2. Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={500}
  height={300}
  alt="Description"
  loading="lazy"
/>
```

#### 3. Bundle Analysis

```bash
# Analyze bundle size
pnpm build --analyze
```

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+

---

## 🚢 Deployment

### Vercel Deployment

The client is deployed to Vercel:

1. **Connect Repository**: Import from GitHub
2. **Configure Build**: 
   - Root Directory: `client`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
3. **Set Environment Variables**: Add `NEXT_PUBLIC_API_URL`
4. **Deploy**: Automatic deployments on push

### Build Configuration

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### Environment Variables

Production environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-server.railway.app
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.r2.dev
NODE_ENV=production
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## 🤝 Contributing

### Development Guidelines

1. **Follow TypeScript**: Use strict typing
2. **Component Structure**: Follow established patterns
3. **Styling**: Use Tailwind utility classes
4. **State Management**: Use Zustand for client state, React Query for server state
5. **Testing**: Write tests for new features
6. **Documentation**: Update README for significant changes

### Code Style

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use meaningful variable names
- Add JSDoc comments for complex logic

---

<div align="center">

**Built with ❤️ for Complyx**

[⬆ Back to Top](#-complyx-client)

</div>
