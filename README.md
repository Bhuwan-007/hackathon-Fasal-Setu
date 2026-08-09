<div align="center">
  <h1>Fasal-Setu</h1>
  <p><strong>Traceability Copilot - Atmospheric Edition</strong></p>
</div>

<br/>

## The Importance

Indian agriculture is highly susceptible to climate volatility, leaving millions of farmers vulnerable to sudden weather shifts and unpredictable market prices. 

**Fasal-Setu** bridges the gap between hyper-local environmental data and actionable agricultural intelligence. By delivering real-time weather telemetry paired with AI-driven crop and pricing advisories directly to the farmer, it empowers them to make data-backed decisions on **what to plant, when to harvest, and how much to sell it for**. The interface is designed from the ground up to be accessible, completely bilingual (English and Hindi), and extremely resilient to network issues.

---

## System Architecture

The application follows a resilient **AI-First, Mock-Fallback** architectural pattern designed for maximum uptime and speed.

### 1. Frontend Layer
* **Framework:** Next.js 16 (App Router) with React 19 (Turbopack).
* **Styling:** Tailwind CSS V4 + Vanilla CSS for custom glassmorphism, textures (e.g., stem/bark patterns), and micro-animations.
* **State Management:** React Context (`AppProvider`) for global localization (`en`/`hi`) and location-awareness.
* **Caching:** Heavy utilization of `sessionStorage` and `localStorage` to aggressively cache API responses (weather, market prices, AI advisories) to prevent redundant network requests and provide instant tab-switching.

### 2. Backend / API Layer
* **Runtime:** Next.js Serverless Route Handlers (Vercel Edge/Node compatible).
* **Resilience:** Every route implements a strict `try/catch` fallback mechanism. If an external API fails or rate-limits, the system instantly falls back to highly accurate, localized mock datasets.

### 3. Intelligence Engine (AI)
* **Model:** Meta's Llama 3.1 8B (`llama-3.1-8b-instant`) via Groq API.
* **Configuration:** Low temperature (`0.2`) ensures accurate, predictable JSON structures and perfect Hindi character rendering.
* **Capabilities:** 
  - Dynamic crop recommendations based on 14-day weather telemetry.
  - Hyper-local pricing advice ("Quick Sell Targets").
  - Daily farm operational advisories.

### 4. Telemetry Integration
* **Weather Data:** Open-Meteo API (Latitude/Longitude based 14-day forecasting and historical analysis).
