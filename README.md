# AnaMas - AI-Powered Analytics Dashboard

A production-ready analytics dashboard with AI-powered insights, built with Next.js, TypeScript, and shadcn/ui.

## 🚀 Features

- **Real-time Analytics**: Live data visualization with interactive charts
- **AI-Powered Insights**: Intelligent business recommendations (OpenAI integration)
- **Responsive Design**: Beautiful UI that works on all devices
- **Production Ready**: Error boundaries, caching, and performance optimization
- **Modular Architecture**: Reusable components and clean code organization

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **AI Integration**: Vercel AI SDK with OpenAI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd anamas-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Features Configuration (Optional)

AnaMas works perfectly without API keys using intelligent fallback insights. To enable full AI-powered analytics:

1. **Get an OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

3. **Restart the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with sidebar
│   ├── page.tsx           # Dashboard overview
│   ├── sales/             # Sales analytics page
│   └── insights/          # AI insights page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard-specific components
│   ├── app-sidebar.tsx    # Main navigation sidebar
│   └── error-boundary.tsx # Error handling component
├── lib/
│   └── analytics-data.ts  # Data management and utilities
└── README.md
\`\`\`

## 🎯 Key Components

### Dashboard Components
- **MetricsGrid**: Key performance indicators with trend analysis
- **ChartsSection**: Interactive revenue and user growth charts
- **AIInsightsPanel**: AI-powered business recommendations
- **RecentActivity**: Real-time user activity feed

### Utility Classes
- **AnalyticsService**: Centralized data management with caching
- **PerformanceMonitor**: Performance tracking and optimization
- **ErrorBoundary**: Graceful error handling and recovery

## 🔧 Customization

### Adding New Metrics
1. Update the `AnalyticsService` in `lib/analytics-data.ts`
2. Create new metric cards in `components/dashboard/metrics-grid.tsx`
3. Add corresponding chart visualizations

### Extending AI Insights
1. Modify the insight generation logic in `ai-insights-panel.tsx`
2. Add new insight types and analysis patterns
3. Customize the confidence scoring system

### Theme Customization
- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for theme configuration
- Customize component variants in shadcn/ui components

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application is a standard Next.js app and can be deployed to any platform that supports Node.js.

## 📊 Performance Features

- **Intelligent Caching**: 5-minute TTL for API responses
- **Lazy Loading**: Components load progressively
- **Error Recovery**: Graceful fallbacks for all external dependencies
- **Performance Monitoring**: Built-in timing and metrics tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel AI SDK](https://sdk.vercel.ai/) for AI integration
- [Recharts](https://recharts.org/) for chart visualizations
- [Lucide](https://lucide.dev/) for icons

