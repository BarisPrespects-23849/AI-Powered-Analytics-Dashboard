# 🚀 AnaMas – AI-Powered Analytics Dashboard

A modern, production-ready analytics dashboard delivering real-time metrics and intelligent insights. Built using **Next.js**, **TypeScript**, and **shadcn/ui**, with **Gemini AI** integration for actionable business recommendations.

---

## ✨ Features

* **📊 Real-Time Analytics** – Interactive, live data visualizations
* **🧠 Gemini AI Insights** – Context-aware business recommendations via Gemini
* **📱 Responsive UI** – Seamlessly adapts to all screen sizes
* **⚙️ Production Ready** – Error boundaries, smart caching, lazy loading
* **🧩 Modular Architecture** – Clean structure with reusable components

---

## 🛠 Tech Stack

| Category       | Tooling                  |
| -------------- | ------------------------ |
| Framework      | Next.js 14 (App Router)  |
| Language       | TypeScript               |
| UI Components  | shadcn/ui                |
| Styling        | Tailwind CSS             |
| Charts         | Recharts                 |
| AI Integration | Gemini via Vercel AI SDK |
| Icons          | Lucide React             |

---

## ⚡ Quick Start

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd anamas-dashboard
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Visit in Browser**
   Open [http://localhost:3000](http://localhost:3000)

---

## 🤖 Gemini AI Integration (Optional)

AnaMas works without API keys using default fallback logic. To unlock AI-powered analytics with **Gemini**:

1. **Get a Gemini API Key**

   * Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and generate an API key

2. **Configure Environment Variables**
   Create a `.env.local` file in the project root:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Restart Dev Server**

   ```bash
   npm run dev
   ```

---

## 🧱 Project Structure

```
├── app/                    # App Router pages
│   ├── layout.tsx         # Layout with navigation
│   ├── page.tsx           # Main dashboard
│   ├── sales/             # Sales analytics
│   └── insights/          # Gemini-powered insights
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard-specific UI
│   ├── app-sidebar.tsx    # Sidebar navigation
│   └── error-boundary.tsx # Error handler
├── lib/
│   └── analytics-data.ts  # Core analytics logic
└── README.md
```

---

## 🧩 Key Components

### Dashboard

* **MetricsGrid** – Key indicators and trends
* **ChartsSection** – User/revenue growth charts
* **AIInsightsPanel** – Gemini-powered suggestions
* **RecentActivity** – Live user activity feed

### Utilities

* **AnalyticsService** – Data management with caching
* **PerformanceMonitor** – Tracks runtime performance
* **ErrorBoundary** – Handles UI failures gracefully

---

## 🎨 Customization Guide

### ➕ Add New Metrics

1. Add data to `AnalyticsService` in `lib/analytics-data.ts`
2. Create metric cards in `components/dashboard/metrics-grid.tsx`
3. Include matching chart visualizations

### 🤖 Extend AI Capabilities

1. Update logic in `AIInsightsPanel`
2. Add new prompt types and analysis strategies
3. Tune the confidence scoring system

### 🎨 Theme Customization

* Global styles: `app/globals.css`
* Tailwind theme: `tailwind.config.ts`
* Component variants: override in `shadcn/ui` as needed

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect the repo on [vercel.com](https://vercel.com)
3. Add your environment variables
4. Enjoy automatic deployments

### Other Hosting Options

AnaMas is a standard Next.js app and works on any Node.js-compatible platform.

---

## ⚡ Performance Highlights

* **Smart Caching** – 5-minute TTL for API responses
* **Lazy Loading** – On-demand component loading
* **Error Resilience** – Fallbacks for all external APIs
* **Built-in Monitoring** – Performance logs and timing hooks

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch:
   `git checkout -b feature/your-feature`
3. Commit changes:
   `git commit -m "Add: your message"`
4. Push and open a PR

---

## 📄 License

Licensed under the MIT License. See `LICENSE` for more details.

---

## 🙌 Acknowledgments

* [shadcn/ui](https://ui.shadcn.com/) – UI component library
* [Vercel AI SDK](https://sdk.vercel.ai/) – AI integration
* [Gemini (Google AI)](https://deepmind.google/technologies/gemini) – Language model powering analytics
* [Recharts](https://recharts.org/) – Charting library
* [Lucide](https://lucide.dev/) – Icon pack
